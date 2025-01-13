<?php
session_start();

if (!isset($_SESSION['username'])) {
    header('Location: index.html');
    exit;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <!-- Include Web3.js -->
    <script src="https://cdn.jsdelivr.net/npm/web3@1.7.3/dist/web3.min.js"></script>
    <!-- Include pet.js -->
    <script src="smartcontract/pet.js" defer></script>
    <!-- Include vaccines.js -->
    <script src="smartcontract/vaccines.js" defer></script>
    <!-- Include health_record.js -->
    <script src="smartcontract/health_record.js" defer></script>
    <title>Home</title>
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

<!-- Pet Registration Modal -->
<div id="petRegistrationModal" class="modal">
    <div class="modal-content">
        <h2>Register Your Pet</h2>
        <form id="pet-registration-form">
            <div>
                <label for="species">Species:</label>
                <input type="text" id="species" name="species" required>
            </div>
            <div>
                <label for="breed">Breed:</label>
                <input type="text" id="breed" name="breed" required>
            </div>
            <div>
                <label for="age">Age:</label>
                <input type="number" id="age" name="age" required>
            </div>
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" placeholder="Unnamed Pet">
            </div>
            <div>
                <label for="description">Description:</label>
                <textarea id="description" name="description" required></textarea>
            </div>
            <div>
                <label for="photo">Photo URL:</label>
                <input type="text" id="photo" name="photo" required>
            </div>
            <!-- Vaccine Details Section -->
            <div id="vaccine-section">
                <h3>Vaccines</h3>
                <div class="vaccine-entry">
                    <label for="vaccine-name">Vaccine Name:</label>
                    <input type="text" name="vaccine-name[]" required>

                    <label for="date-administered">Date Administered:</label>
                    <input type="date" name="date-administered[]" required>

                    <label for="next-due-date">Next Due Date:</label>
                    <input type="date" name="next-due-date[]">
                </div>
                <button type="button" id="add-more-vaccine">Add More Vaccine</button>
            </div>
            <!-- Health Records Section -->
            <div id="health-record-section">
                <h3>Health Records</h3>
                <div class="health-record-entry">
                    <label for="health-description">Description:</label>
                    <textarea name="health-description[]" required></textarea>

                    <label for="health-date">Date:</label>
                    <input type="date" name="health-date[]" required>
                </div>
        <button type="button" id="add-more-health-record">Add More Health Record</button>
    </div>
            <button type="button" id="register-button">Register Pet</button>
        </form>
        <button type="button" id="closeModalButton">Close</button>
    </div>
</div>


<script>
    // Modal Handling
    document.getElementById("addPetButton").onclick = function () {
        document.getElementById("petRegistrationModal").style.display = "flex";
    };

    document.getElementById("closeModalButton").onclick = function () {
        document.getElementById("petRegistrationModal").style.display = "none";
    };

    window.onclick = function (event) {
        const modal = document.getElementById("petRegistrationModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
    const vaccineSection = document.getElementById("vaccine-section");

    document.addEventListener("DOMContentLoaded", () => {
    // Add more vaccine fields
    document.getElementById("add-more-vaccine").onclick = () => {
        const vaccineEntry = document.createElement("div");
        vaccineEntry.className = "vaccine-entry";
        vaccineEntry.innerHTML = `
            <label for="vaccine-name">Vaccine Name:</label>
            <input type="text" name="vaccine-name[]" required>

            <label for="date-administered">Date Administered:</label>
            <input type="date" name="date-administered[]" required>

            <label for="next-due-date">Next Due Date:</label>
            <input type="date" name="next-due-date[]">
        `;
        document.getElementById("vaccine-section").appendChild(vaccineEntry);
    };

    // Add more health record fields
    document.getElementById("add-more-health-record").onclick = () => {
        const healthEntry = document.createElement("div");
        healthEntry.className = "health-record-entry";
        healthEntry.innerHTML = `
            <label for="health-description">Description:</label>
            <textarea name="health-description[]" required></textarea>

            <label for="health-date">Date:</label>
            <input type="date" name="health-date[]" required>
        `;
        document.getElementById("health-record-section").appendChild(healthEntry);
    };

    // Register pet
    document.getElementById("register-button").onclick = registerPetWithRecords;
});

});


</script>

<div id="pets-list">

</div>


<!-- Filter Form -->
<form method="GET" action="home.php" class="filter-form">
    <label for="breed">Breed:</label>
    <input type="text" id="breed" name="breed" placeholder="Enter breed" value="<?= htmlspecialchars($_GET['breed'] ?? '') ?>">

    <label for="age">Age:</label>
    <input type="number" id="age" name="age" placeholder="Enter age" value="<?= htmlspecialchars($_GET['age'] ?? '') ?>">

    <label for="city">City:</label>
    <input type="text" id="city" name="city" placeholder="Enter city" value="<?= htmlspecialchars($_GET['city'] ?? '') ?>">

    <button type="submit">Filter</button>
    <a href="home.php" class="clear-filters">Clear Filters</a>
</form>


<!-- Results Section -->
<div class="animal-list" id="animalList">
    <p>Loading pets...</p>
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
    async function registerPet() {
        const species = document.getElementById("species").value;
        const breed = document.getElementById("breed").value;
        const age = document.getElementById("age").value;
        const name = document.getElementById("name").value || "Unnamed Pet";
        const description = document.getElementById("description").value;
        const photo = document.getElementById("photo").value;

        const vaccineNames = Array.from(document.querySelectorAll('input[name="vaccine-name[]"]')).map(input => input.value);
        const datesAdministered = Array.from(document.querySelectorAll('input[name="date-administered[]"]')).map(input => new Date(input.value).getTime() / 1000);
        const nextDueDates = Array.from(document.querySelectorAll('input[name="next-due-date[]"]')).map(input => input.value ? new Date(input.value).getTime() / 1000 : 0);

        const healthDescriptions = Array.from(document.querySelectorAll('textarea[name="health-description[]"]')).map(input => input.value);
        const healthDates = Array.from(document.querySelectorAll('input[name="health-date[]"]')).map(input => new Date(input.value).getTime() / 1000);

        try {
           
            const accounts = await web3.eth.getAccounts();
            const sender = accounts[0];

            // Add pet to the blockchain
            const petId = await contract.methods.addPet(species, breed, age, name, description, photo).send({ from: sender });

            // Add vaccine records for the registered pet
            for (let i = 0; i < vaccineNames.length; i++) {
                await addVaccineRecord(petId, vaccineNames[i], datesAdministered[i], nextDueDates[i]);
            }

            // Add health records for the registered pet
            for (let i = 0; i < healthDescriptions.length; i++) {
                await addHealthRecord(petId, healthDescriptions[i], healthDates[i]);
            }

            alert("Pet registered successfully with vaccine and health records!");
        } catch (error) {
            console.error("Error registering pet:", error);
            alert("Failed to register pet. Check console for details.");
        }
    }


    async function fetchAllPets() {
        const animalListContainer = document.getElementById("animalList");
        animalListContainer.innerHTML = "<p>Loading pets...</p>";

        try {
            // Assuming contract.methods.nextPetId() returns the next available pet ID (total number of pets + 1)
            const totalPets = await contract.methods.nextPetId().call();
            const pets = [];

            for (let petId = 1; petId < totalPets; petId++) {
                try {
                    const pet = await contract.methods.getPet(petId).call();
                    pets.push(pet);
                } catch (err) {
                    console.warn(`Failed to fetch pet with ID ${petId}:`, err);
                }
            }

            // Apply filters if necessary
            const urlParams = new URLSearchParams(window.location.search);
            const breedFilter = urlParams.get("breed")?.toLowerCase() || "";
            const ageFilter = parseInt(urlParams.get("age"), 10) || null;
            const cityFilter = urlParams.get("city")?.toLowerCase() || "";

            const filteredPets = pets.filter(pet => {
                const ageInYears = Math.floor((Date.now() / 1000 - pet.birthDate) / (365 * 24 * 60 * 60));
                const breedMatch = breedFilter ? pet.breed.toLowerCase().includes(breedFilter) : true;
                const ageMatch = ageFilter !== null ? ageInYears === ageFilter : true;
                const cityMatch = cityFilter ? pet.ownerId.toLowerCase().includes(cityFilter) : true; // Assuming city is mapped to ownerId (update logic if needed)
                return breedMatch && ageMatch && cityMatch;
            });

            if (filteredPets.length === 0) {
                animalListContainer.innerHTML = "<p>No pets found matching the criteria.</p>";
                return;
            }

            // Render filtered pets dynamically
            animalListContainer.innerHTML = filteredPets.map(pet => `
                <div class="animal-item">
                    <img src="${pet.photo}" alt="${pet.name}" class="animal-photo" style="width: 150px; height: 150px;">
                    <h3>${pet.name || "Unnamed Pet"}</h3>
                    <p>Breed: ${pet.breed}</p>
                    <p>Age: ${Math.floor((Date.now() / 1000 - pet.birthDate) / (365 * 24 * 60 * 60))} years</p>
                    <a href="view_animal.php?id=${pet.id}" class="view-button">View</a>
                </div>
            `).join("");
        } catch (error) {
            console.error("Error fetching pets:", error);
            animalListContainer.innerHTML = "<p>Failed to load pets. Please try again later.</p>";
        }
    }

    // Call fetchAllPets when the page loads
    document.addEventListener("DOMContentLoaded", fetchAllPets);

</script>
</body>
</html>
