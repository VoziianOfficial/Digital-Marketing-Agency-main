<?php

declare(strict_types=1);

/* =========================================================
   LLC Advantshield — CONTACT FORM HANDLER
   contact.php
   ========================================================= */


/* =========================================================
   RESPONSE
   ========================================================= */

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');


function respond(
    bool $success,
    string $message,
    int $statusCode = 200
): never {
    http_response_code($statusCode);

    echo json_encode(
        [
            'success' => $success,
            'message' => $message
        ],
        JSON_UNESCAPED_UNICODE |
        JSON_UNESCAPED_SLASHES
    );

    exit;
}


/* =========================================================
   ONLY POST
   ========================================================= */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(
        false,
        'Method not allowed.',
        405
    );
}


/* =========================================================
   HELPERS
   ========================================================= */

function cleanText(
    mixed $value,
    int $maxLength = 500
): string {
    if (!is_string($value)) {
        return '';
    }

    $value = trim($value);

    $value = strip_tags($value);

    $value = preg_replace(
        '/[^\P{C}\n\r\t]+/u',
        '',
        $value
    ) ?? '';

    if (mb_strlen($value) > $maxLength) {
        $value = mb_substr(
            $value,
            0,
            $maxLength
        );
    }

    return $value;
}


function cleanHeaderValue(
    mixed $value,
    int $maxLength = 200
): string {
    $value = cleanText(
        $value,
        $maxLength
    );

    return str_replace(
        ["\r", "\n"],
        '',
        $value
    );
}


function getRecipientEmail(): string
{
    /*
     * Email is read from config/config.js
     * so the visible website email and the form
     * recipient stay synchronised.
     */

    $configPath =
        __DIR__ .
        DIRECTORY_SEPARATOR .
        'config' .
        DIRECTORY_SEPARATOR .
        'config.js';


    if (is_file($configPath)) {
        $config = file_get_contents(
            $configPath
        );

        if (
            is_string($config) &&
            preg_match(
                '/\bemail\s*:\s*["\']([^"\']+)["\']/i',
                $config,
                $matches
            )
        ) {
            $email = filter_var(
                trim($matches[1]),
                FILTER_VALIDATE_EMAIL
            );

            if ($email !== false) {
                return $email;
            }
        }
    }


    /*
     * Emergency fallback only.
     */

    return 'hello@advantshield.com';
}


function buildSenderEmail(
    string $recipientEmail
): string {
    $host =
        $_SERVER['HTTP_HOST'] ?? '';

    $host = preg_replace(
        '/:\d+$/',
        '',
        strtolower($host)
    ) ?? '';

    $host = preg_replace(
        '/^www\./',
        '',
        $host
    ) ?? '';


    if (
        $host !== '' &&
        $host !== 'localhost' &&
        filter_var(
            'noreply@' . $host,
            FILTER_VALIDATE_EMAIL
        )
    ) {
        return 'noreply@' . $host;
    }


    /*
     * For localhost / unusual development hosts,
     * use the configured site email.
     */

    return $recipientEmail;
}


/* =========================================================
   OPTIONAL HONEYPOT
   ========================================================= */

/*
 * If a hidden field called "website_url"
 * is added later, bots filling it will be rejected.
 */

$honeypot = cleanText(
    $_POST['website_url'] ?? '',
    100
);

if ($honeypot !== '') {
    respond(
        true,
        'Thank you. Your message has been successfully sent.'
    );
}


/* =========================================================
   FORM DATA
   ========================================================= */

$name = cleanHeaderValue(
    $_POST['name'] ?? '',
    120
);

$emailRaw = cleanHeaderValue(
    $_POST['email'] ?? '',
    180
);

$company = cleanHeaderValue(
    $_POST['company'] ?? '',
    180
);

$website = cleanHeaderValue(
    $_POST['website'] ?? '',
    300
);

$service = cleanHeaderValue(
    $_POST['service'] ?? '',
    180
);

$formSource = cleanHeaderValue(
    $_POST['form_source'] ?? 'website',
    120
);

$message = cleanText(
    $_POST['message'] ?? '',
    5000
);

$privacy = cleanHeaderValue(
    $_POST['privacy'] ?? '',
    30
);


/* =========================================================
   VALIDATION
   ========================================================= */

if ($name === '') {
    respond(
        false,
        'Please enter your name.',
        422
    );
}


if (
    mb_strlen($name) < 2 ||
    mb_strlen($name) > 120
) {
    respond(
        false,
        'Please enter a valid name.',
        422
    );
}


$email = filter_var(
    $emailRaw,
    FILTER_VALIDATE_EMAIL
);


if ($email === false) {
    respond(
        false,
        'Please enter a valid email address.',
        422
    );
}


if ($message === '') {
    respond(
        false,
        'Please enter your message.',
        422
    );
}


if (mb_strlen($message) < 10) {
    respond(
        false,
        'Please provide a little more information about your enquiry.',
        422
    );
}


if ($privacy !== 'accepted') {
    respond(
        false,
        'Please accept the Privacy Policy before submitting the form.',
        422
    );
}


/* =========================================================
   RECIPIENT
   ========================================================= */

$recipientEmail =
    getRecipientEmail();

$senderEmail =
    buildSenderEmail(
        $recipientEmail
    );


/* =========================================================
   SUBJECT
   ========================================================= */

$subjectService =
    $service !== ''
        ? $service
        : 'General Enquiry';


$subject =
    'LLC Advantshield Website Enquiry — ' .
    $subjectService;


/*
 * Encode subject for UTF-8 mail clients.
 */

$encodedSubject =
    '=?UTF-8?B?' .
    base64_encode($subject) .
    '?=';


/* =========================================================
   EMAIL BODY
   ========================================================= */

$lines = [];

$lines[] =
    'NEW WEBSITE ENQUIRY';

$lines[] =
    str_repeat('-', 46);

$lines[] =
    '';

$lines[] =
    'Name: ' .
    $name;

$lines[] =
    'Email: ' .
    $email;


if ($company !== '') {
    $lines[] =
        'Company / Brand: ' .
        $company;
}


if ($website !== '') {
    $lines[] =
        'Website: ' .
        $website;
}


if ($service !== '') {
    $lines[] =
        'Service: ' .
        $service;
}


$lines[] =
    'Form source: ' .
    $formSource;

$lines[] =
    '';

$lines[] =
    'MESSAGE';

$lines[] =
    str_repeat('-', 46);

$lines[] =
    '';

$lines[] =
    $message;

$lines[] =
    '';

$lines[] =
    str_repeat('-', 46);

$lines[] =
    'Privacy Policy accepted: Yes';

$lines[] =
    'Submitted: ' .
    gmdate('Y-m-d H:i:s') .
    ' UTC';


$mailBody =
    implode(
        PHP_EOL,
        $lines
    );


/* =========================================================
   MAIL HEADERS
   ========================================================= */

$headers = [];

$headers[] =
    'MIME-Version: 1.0';

$headers[] =
    'Content-Type: text/plain; charset=UTF-8';

$headers[] =
    'Content-Transfer-Encoding: 8bit';

$headers[] =
    'From: LLC Advantshield Website <' .
    $senderEmail .
    '>';

$headers[] =
    'Reply-To: ' .
    $name .
    ' <' .
    $email .
    '>';

$headers[] =
    'X-Mailer: PHP/' .
    phpversion();


/* =========================================================
   SEND
   ========================================================= */

$mailSent = @mail(
    $recipientEmail,
    $encodedSubject,
    $mailBody,
    implode(
        "\r\n",
        $headers
    )
);


/* =========================================================
   RESULT
   ========================================================= */

if (!$mailSent) {
    respond(
        false,
        'Something went wrong. Please try again.',
        500
    );
}


respond(
    true,
    'Thank you. Your message has been successfully sent.'
);
