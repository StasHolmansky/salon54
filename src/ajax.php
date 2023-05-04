<?php
// Токен телеграм бота
$tg_bot_token = "5800484250:AAG8pEnae5Abim5wv5YmmiKS4AS84TeiVfE";
// ID Чата
$chat_id = "-1001848728891";

$text = '';

foreach ($_POST as $key => $val) {
    $text .= $key . ": " . $val . "\n";
}

$text .= "\n" . $_SERVER['REMOTE_ADDR'];
$text .= "\n" . date('d.m.y H:i:s');

$param = [
    "chat_id" => $chat_id,
    "text" => $text
];

$url = "https://api.telegram.org/bot" . $tg_bot_token . "/sendMessage?" . http_build_query($param);

var_dump($text);

file_get_contents($url);

die('1');
