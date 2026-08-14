<?php
/**
 * Réception du formulaire de contact d'alexcolas.com.
 *
 * Les messages partent directement vers la boîte du domaine : aucune
 * donnée ne transite par un service tiers, ce qui garde exactes les
 * mentions légales du site (« Destinataire : Alexandre Colas
 * uniquement »).
 *
 * Écrit pour PHP 7.4 et suivants.
 */

$DESTINATAIRE = 'contact@alexcolas.com';

// L'expéditeur doit rester une adresse du domaine : avec l'adresse du
// visiteur, le message échoue au contrôle SPF et part en indésirables.
// C'est le champ « Répondre à » qui porte son adresse.
$EXPEDITEUR = 'contact@alexcolas.com';

$MAX_PAR_HEURE = 5;

date_default_timezone_set('Europe/Paris');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function repondre($code, $corps) {
    http_response_code($code);
    echo json_encode($corps, JSON_UNESCAPED_UNICODE);
    exit;
}

function longueur($chaine) {
    return function_exists('mb_strlen') ? mb_strlen($chaine, 'UTF-8') : strlen($chaine);
}

function champ($source, $cle) {
    return isset($source[$cle]) ? trim((string) $source[$cle]) : '';
}

/* ── 1. Méthode ────────────────────────────────────────────────── */
if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    repondre(405, array('erreur' => 'Méthode non autorisée.'));
}

/* ── 2. Lecture ────────────────────────────────────────────────── */
$donnees = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($donnees)) {
    $donnees = $_POST;
}

$nom     = champ($donnees, 'nom');
$email   = champ($donnees, 'email');
$projet  = champ($donnees, 'projet');
$message = champ($donnees, 'message');
$piege   = champ($donnees, 'site_web');

/* ── 3. Piège à robots ─────────────────────────────────────────── */
// Le champ est invisible : un humain ne peut pas le remplir. On répond
// comme si tout s'était bien passé, pour ne rien apprendre au robot.
if ($piege !== '') {
    repondre(200, array('ok' => true));
}

/* ── 4. Validation ─────────────────────────────────────────────── */
$invalides = array();

if ($nom === '' || longueur($nom) > 100) {
    $invalides[] = 'nom';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || longueur($email) > 190) {
    $invalides[] = 'email';
}
if (longueur($message) < 10 || longueur($message) > 5000) {
    $invalides[] = 'message';
}
// Un retour à la ligne dans ces champs permettrait d'injecter des
// en-têtes dans l'e-mail, donc d'expédier depuis votre domaine.
if (preg_match('/[\r\n]/', $nom . $email . $projet)) {
    $invalides[] = 'format';
}

if ($invalides) {
    repondre(422, array(
        'erreur' => 'Certains champs sont invalides.',
        'champs' => $invalides,
    ));
}

/* ── 5. Limite par adresse IP ──────────────────────────────────── */
$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'inconnue';
$journal = sys_get_temp_dir() . '/ac-contact-' . md5($ip) . '.json';
$maintenant = time();
$suivi = array('debut' => $maintenant, 'nb' => 0);

if (is_readable($journal)) {
    $lu = json_decode((string) file_get_contents($journal), true);
    if (is_array($lu) && isset($lu['debut'], $lu['nb']) && ($maintenant - $lu['debut']) < 3600) {
        $suivi = $lu;
    }
}

if ($suivi['nb'] >= $MAX_PAR_HEURE) {
    repondre(429, array('erreur' => 'Trop de messages envoyés depuis cette connexion. Réessayez dans une heure.'));
}

$suivi['nb']++;
@file_put_contents($journal, json_encode($suivi), LOCK_EX);

/* ── 6. Composition ────────────────────────────────────────────── */
$projets_connus = array(
    'Site vitrine',
    'Landing page',
    "Refonte d'un site existant",
    'Je ne sais pas encore',
);
if (!in_array($projet, $projets_connus, true)) {
    $projet = 'Non précisé';
}

$sujet = '=?UTF-8?B?' . base64_encode('Nouveau projet — ' . $nom) . '?=';

$corps = "Nom            : " . $nom . "\n"
       . "E-mail         : " . $email . "\n"
       . "Type de projet : " . $projet . "\n"
       . "Reçu le        : " . date('d/m/Y à H:i') . "\n"
       . "\n----------------------------------------\n\n"
       . $message . "\n";

$entetes = implode("\r\n", array(
    'From: =?UTF-8?B?' . base64_encode('Site alexcolas.com') . '?= <' . $EXPEDITEUR . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
));

$envoye = @mail($DESTINATAIRE, $sujet, $corps, $entetes, '-f' . $EXPEDITEUR);

if (!$envoye) {
    repondre(500, array('erreur' => "L'envoi a échoué."));
}

repondre(200, array('ok' => true));
