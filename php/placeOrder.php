<?php
/*Install Midtrans PHP Library (https://github.com/Midtrans/midtrans-php)
composer require midtrans/midtrans-php
                              
Alternatively, if you are not using **Composer**, you can download midtrans-php library 
(https://github.com/Midtrans/midtrans-php/archive/master.zip), and then require 
the file manually.   

require_once dirname(__FILE__) . '/pathofproject/Midtrans.php'; */

require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';
//SAMPLE REQUEST START HERE

// Set your Merchant Server Key
\Midtrans\Config::$serverKey = 'SB-Mid-server-qgayIQbZX9rbh81IBu5K2Tci';
// Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
\Midtrans\Config::$isProduction = false;
// Set sanitization on (default)
\Midtrans\Config::$isSanitized = true;
// Set 3DS transaction for credit card to true
\Midtrans\Config::$is3ds = true;
$items = json_decode($_POST['items'], true);
$total = (int) $_POST['total'];

file_put_contents("log.txt", print_r($_POST, true));
file_put_contents("log-items.txt", print_r($items, true));

$itemDetails = array_map(function ($item) {
    return [
        'id' => $item['id'],
        'price' => (int) $item['price'],
        'quantity' => (int) $item['quantity'],
        'name' => $item['name']
    ];
}, $items);


$params = [
    'transaction_details' => [
        'order_id' => 'WARTEG-' . time(), // ID unik
        'gross_amount' => $total
    ],
    'item_details' => $itemDetails,
    'customer_details' => [
        'first_name' => $_POST['name'],
        'email' => $_POST['email'],
        'phone' => $_POST['phone'],
    ]
];

// Ambil Snap token
try {
    $snapToken = \Midtrans\Snap::getSnapToken($params);
    echo $snapToken;
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
?>