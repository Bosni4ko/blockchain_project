<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $file = 'users.json';
    if (!file_exists($file)) {
        echo json_encode(['success' => false, 'message' => 'No users registered yet.']);
        exit;
    }

    $current_data = json_decode(file_get_contents($file), true);

    foreach ($current_data as $user) {
        if ($user['username'] === $username && password_verify($password, $user['password'])) {
            $_SESSION['username'] = $username;
            header('Location: home.php');
            exit;
        }
    }

    echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
}
?>
