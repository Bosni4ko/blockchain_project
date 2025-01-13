<?php
session_start();

if (!isset($_SESSION['username'])) {
    header('Location: index.html');
    exit;
}

// Load user data from the JSON file
$username = $_SESSION['username'];
$userFile = 'user_data.json';
$usersData = file_exists($userFile) ? json_decode(file_get_contents($userFile), true) : [];

// Ensure data for the current user exists
if (!isset($usersData[$username])) {
    $usersData[$username] = [
        'first_name' => '',
        'last_name' => '',
        'email' => '',
        'phone' => '',
        'city' => '',
        'breeder' => false,
        'license' => '',
        'id' => '',
        'compliance' => false,
        'additional_info' => ''
    ];
}
$user = $usersData[$username];

// Example data for demonstration
$animals = [
    1 => [
        'name' => 'Bella',
        'breed' => 'Labrador',
        'age' => 3,
        'city' => 'Riga',
        'photo' => 'photos/max.jpg',
        'description' => 'Friendly and playful.',
        'health_records' => 'No known allergies. Annual check-up on 2023-01-10.',
        'vaccination_records' => ['Rabies', 'Distemper', 'Parvovirus'],
        'chip' => true
    ],
    2 => [
        'name' => 'Max',
        'breed' => 'German Shepherd',
        'age' => 5,
        'city' => 'Riga',
        'photo' => 'photos/max.jpg',
        'description' => 'Loyal and brave.',
        'health_records' => 'Minor hip dysplasia noted. Requires low-impact exercise.',
        'vaccination_records' => ['Rabies', 'Distemper'],
        'chip' => false
    ]
];

// Get the animal ID from the query string
$animal_id = $_GET['id'] ?? null;

if ($animal_id && isset($animals[$animal_id])) {
    $animal = $animals[$animal_id];
} else {
    echo "Animal not found.";
    exit;
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/web3@1.7.3/dist/web3.min.js"></script>
    <script src="smartContract.js" defer></script>
    <title>View Animal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }

        .container {
            max-width: 1200px;
            margin: 50px auto;
            padding: 20px;
            background: #ffffff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            color: #333;
        }

        .content {
            display: flex;
            gap: 20px;
            justify-content: space-between;
        }

        .box {
            flex: 1;
            padding: 20px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .box img {
            display: block;
            width: 100%;
            max-width: 300px;
            height: auto;
            border-radius: 8px;
            margin: 0 auto 20px;
        }

        .box .details {
            text-align: left;
            line-height: 1.6;
            font-size: 16px;
            color: #555;
        }

        .box .details p {
            margin: 10px 0;
        }

        .chat-container {
            display: none;
            flex-direction: column;
            background: #f9f9f9;
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            max-height: 400px;
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            z-index: 1000;
        }

        .chat-header {
            background: #007bff;
            color: #fff;
            padding: 10px;
            font-weight: bold;
            text-align: center;
        }

        .chat-messages {
            flex: 1;
            padding: 10px;
            overflow-y: auto;
            background: #fff;
        }

        .chat-input-container {
            display: flex;
            border-top: 1px solid #ccc;
        }

        .chat-input {
            flex: 1;
            border: none;
            padding: 10px;
            font-size: 14px;
            outline: none;
        }

        .chat-send {
            background: #007bff;
            color: #fff;
            border: none;
            padding: 10px 15px;
            cursor: pointer;
        }

        .chat-send:hover {
            background: #0056b3;
        }

        .back-link {
            display: inline-block;
            margin-top: 20px;
            text-decoration: none;
            color: #007bff;
            font-weight: bold;
            text-align: center;
        }

        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

<div class="navbar">
    <h1>Pet Registry</h1>
    <div class="burger-menu">
        <button id="burgerButton" onclick="toggleMenu()">☰</button>
        <div class="dropdown-menu" id="dropdownMenu">
            <a href="home.php">Home</a>
            <a href="profile.php">Profile</a>
            <div class="menu-item" id="addPetButton">Add Pet</div>
            <form action="logout.php" method="POST">
                <button type="submit">Log out</button>
            </form>
        </div>
    </div>
</div>
<script>
    function toggleMenu() {
        const menu = document.getElementById('dropdownMenu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }

    // Close the menu when clicking outside
    window.onclick = function (event) {
        const menu = document.getElementById('dropdownMenu');
        const button = document.getElementById('burgerButton');
        if (event.target !== menu && event.target !== button) {
            menu.style.display = 'none';
        }
    };

</script>


<div class="container">
    <div class="header">
        <h1>Details for <?= htmlspecialchars($animal['name']) ?></h1>
    </div>
    <div class="content">
        <!-- Animal Details Box -->
        <div class="box">
            <img src="<?= htmlspecialchars($animal['photo']) ?>" alt="<?= htmlspecialchars($animal['name']) ?>" class="animal-photo">
            <div class="details">
                <p><strong>Breed:</strong> <?= htmlspecialchars($animal['breed']) ?></p>
                <p><strong>Age:</strong> <?= htmlspecialchars($animal['age']) ?> years</p>
                <p><strong>City:</strong> <?= htmlspecialchars($animal['city']) ?></p>
                <p><strong>Description:</strong> <?= htmlspecialchars($animal['description']) ?></p>
            </div>
        </div>

        <!-- Health Details Box -->
        <div class="box">
            <h2>Health Information</h2>
            <div class="details">
                <p><strong>Health Records:</strong> <?= htmlspecialchars($animal['health_records']) ?></p>
                <p><strong>Vaccination Records:</strong></p>
                <ul>
                    <?php foreach ($animal['vaccination_records'] as $vaccine): ?>
                        <li><?= htmlspecialchars($vaccine) ?></li>
                    <?php endforeach; ?>
                </ul>
                <p><strong>Chip:</strong> <?= $animal['chip'] ? 'Yes' : 'No' ?></p>
            </div>
        </div>

        <!-- Breeder Details Box -->
        <div class="box">
            <h2>Breeder Information</h2>
            <div class="details">
                <p><strong>Name:</strong> <?= htmlspecialchars($user['first_name'] . ' ' . $user['last_name']) ?></p>
                <p><strong>City:</strong> <?= htmlspecialchars($user['city'] ?: 'Not provided') ?></p>
                <p><strong>Contact:</strong> <?= htmlspecialchars($user['email'] ?: 'Not provided') ?></p>
            </div>
            <button id="openChat">Chat</button>
        </div>


    </div>
    <a href="home.php" class="back-link">Back to Home</a>
</div>


<!-- Chat Box -->
<div class="chat-container" id="chatContainer">
    <div class="chat-header">
        Chat with Breeder
        <button id="closeChat" style="background: none; border: none; font-size: 18px; color: #fff; cursor: pointer; float: right;">✖</button>
    </div>
    <div class="chat-messages" id="chatMessages">
        <!-- Messages will appear here -->
    </div>
    <div class="chat-input-container">
        <input type="text" id="chatInput" class="chat-input" placeholder="Type a message...">
        <button id="sendMessage" class="chat-send">Send</button>
    </div>
</div>

<script>
    const openChatButton = document.getElementById('openChat');
    const closeChatButton = document.getElementById('closeChat');
    const chatContainer = document.getElementById('chatContainer');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessageButton = document.getElementById('sendMessage');

    let chatData = JSON.parse(localStorage.getItem('chatData')) || []; // Load chat data from local storage

    // Display chat messages
    function displayMessages() {
        chatMessages.innerHTML = '';
        chatData.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = message;
            chatMessages.appendChild(messageDiv);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }

    // Open chat
    openChatButton.onclick = () => {
        chatContainer.style.display = 'flex';
        displayMessages();
    };

    // Close chat
    closeChatButton.onclick = () => {
        chatContainer.style.display = 'none';
    };

    // Send message
    sendMessageButton.onclick = () => {
        const message = chatInput.value.trim();
        if (message) {
            chatData.push(message); // Add message to chat data
            localStorage.setItem('chatData', JSON.stringify(chatData)); // Save to local storage
            chatInput.value = '';
            displayMessages();
        }
    };

    // Close chat when clicking outside
    window.onclick = (event) => {
        if (event.target === chatContainer) {
            chatContainer.style.display = 'none';
        }
    };
</script>
</body>
</html>



