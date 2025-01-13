<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    if ($password !== $confirm_password) {
        echo json_encode(['success' => false, 'message' => 'Passwords do not match.']);
        exit;
    }

    $data = [
        'username' => $username,
        'password' => password_hash($password, PASSWORD_DEFAULT)
    ];

    $file = 'users.json';
    if (file_exists($file)) {
        $current_data = json_decode(file_get_contents($file), true);
    } else {
        $current_data = [];
    }

    $current_data[] = $data;

    file_put_contents($file, json_encode($current_data, JSON_PRETTY_PRINT));

    // Set session and redirect to home
    $_SESSION['username'] = $username;
    header('Location: home.php');
    exit;
}
?>
