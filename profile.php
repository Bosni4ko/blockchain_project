<?php
session_start();

if (!isset($_SESSION['username'])) {
    header('Location: index.html');
    exit;
}

// Load or initialize user data specific to the logged-in user
$username = $_SESSION['username'];
$userFile = 'user_data.json';
$usersData = file_exists($userFile) ? json_decode(file_get_contents($userFile), true) : [];

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

// Save updated data if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usersData[$username] = [
        'first_name' => $_POST['first_name'] ?? '',
        'last_name' => $_POST['last_name'] ?? '',
        'email' => $_POST['email'] ?? '',
        'phone' => $_POST['phone'] ?? '',
        'city' => $_POST['city'] ?? '',
        'breeder' => isset($_POST['breeder']),
        'license' => $_POST['license'] ?? '',
        'id' => $_POST['id'] ?? '',
        'compliance' => isset($_POST['compliance']),
        'additional_info' => $_POST['additional_info'] ?? ''
    ];
    file_put_contents($userFile, json_encode($usersData, JSON_PRETTY_PRINT));
    $user = $usersData[$username]; // Reload user data
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
    <title>Profile</title>
    <style>
        .form-container {
            max-width: 650px;
            margin: 50px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            background-color: #f9f9f9;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }

        .form-container label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
        }

        .form-container input, .form-container textarea {
            width: 100%;
            padding: 5px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
        }

        .form-container button {
            padding: 10px 20px;
            font-size: 14px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .form-container .edit-button {
            background-color: #007bff;
            color: white;
        }

        .form-container .save-button {
            background-color: #28a745;
            color: white;
        }

        .form-container button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        .breeder-fields {
            display: none;
            margin-top: 20px;
            border-top: 1px solid #ccc;
            padding-top: 20px;
        }

        .breeder-fields input, .breeder-fields textarea {
            width: 100%;
            margin-bottom: 10px;
        }

        .breeder-fields label {
            margin-bottom: 5px;
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


<div class="form-container">
    <form id="profile-form" method="POST">
        <label for="first_name">First Name:</label>
        <input type="text" id="first_name" name="first_name" value="<?= htmlspecialchars($user['first_name']) ?>" disabled>

        <label for="last_name">Last Name:</label>
        <input type="text" id="last_name" name="last_name" value="<?= htmlspecialchars($user['last_name']) ?>" disabled>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" value="<?= htmlspecialchars($user['email']) ?>" disabled>

        <label for="phone">Phone:</label>
        <input type="text" id="phone" name="phone" value="<?= htmlspecialchars($user['phone']) ?>" disabled>

        <label for="city">City:</label>
        <input type="text" id="city" name="city" value="<?= htmlspecialchars($user['city']) ?>" disabled>

        <div id="breeder-section">
            <label>
                Breeder
                <input type="checkbox" id="breeder-checkbox" name="breeder" <?= $user['breeder'] ? 'checked' : '' ?> disabled>
            </label>

            <div class="breeder-fields" id="breeder-fields" style="display: <?= $user['breeder'] ? 'block' : 'none' ?>;">
                <label for="license">License:</label>
                <input type="text" id="license" name="license" value="<?= htmlspecialchars($user['license']) ?>" disabled>

<!--                <label for="id">ID/Passport:</label>-->
<!--                <input type="text" id="id" name="id" value="--><?php //= htmlspecialchars($user['id']) ?><!--" disabled>-->

                <label>
                    I comply with the laws on breeding and keeping animals.
                    <input type="checkbox" id="compliance-checkbox" name="compliance" <?= $user['compliance'] ? 'checked' : '' ?> disabled>
                </label>

                <label for="additional_info">Additional Information:</label>
                <textarea id="additional_info" name="additional_info" disabled><?= htmlspecialchars($user['additional_info']) ?></textarea>
            </div>
        </div>

        <button type="button" id="edit-button" class="edit-button">Edit</button>
        <button type="submit" id="save-button" class="save-button" style="display: none;">Save</button>
    </form>
</div>

<script>
    const editButton = document.getElementById("edit-button");
    const saveButton = document.getElementById("save-button");
    const formInputs = document.querySelectorAll("#profile-form input, #profile-form textarea");
    const breederCheckbox = document.getElementById("breeder-checkbox");
    const breederFields = document.getElementById("breeder-fields");
    const complianceCheckbox = document.getElementById("compliance-checkbox");

    // Make form editable when "Edit" is clicked
    editButton.addEventListener("click", () => {
        formInputs.forEach(input => input.disabled = false); // Enable all inputs
        editButton.style.display = "none"; // Hide "Edit" button
        saveButton.style.display = "inline-block"; // Show "Save" button
    });

    // Show breeder fields when checkbox is checked
    breederCheckbox.addEventListener("change", () => {
        if (breederCheckbox.checked) {
            breederFields.style.display = "block";
        } else {
            breederFields.style.display = "none";
            complianceCheckbox.checked = false; // Uncheck compliance if breeder unchecked
        }
    });

    // Validate compliance checkbox before saving
    saveButton.addEventListener("click", (event) => {
        if (breederCheckbox.checked && !complianceCheckbox.checked) {
            alert("You must comply with the laws on breeding and keeping animals.");
            event.preventDefault();
            return;
        }
    });
</script>

</body>
</html>
