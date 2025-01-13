function showRegisterForm() {
    document.getElementById('registerModal').style.display = 'flex';
}

function closeRegisterForm() {
    document.getElementById('registerModal').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginForm() {
    document.getElementById('loginModal').style.display = 'none';
}

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

document.getElementById("filter-button").onclick = function() {
    document.getElementById("filter-form").submit();
};

// Attach the registerPet function to the button in the form
document.getElementById("register-button").onclick = registerPet;

function applyFilters() {
    const breedFilter = document.getElementById("filter-breed").value.toLowerCase();
    const ageFilter = document.getElementById("filter-age").value;
    const cityFilter = document.getElementById("filter-city").value.toLowerCase();

    const allPets = Array.from(document.querySelectorAll(".animal-item"));
    allPets.forEach(petDiv => {
        const breed = petDiv.querySelector("h3").innerText.toLowerCase();
        const age = petDiv.querySelector("p:nth-child(2)").innerText.match(/\d+/)?.[0];
        const description = petDiv.querySelector("p:nth-child(3)").innerText.toLowerCase();

        const matchesBreed = breedFilter ? breed.includes(breedFilter) : true;
        const matchesAge = ageFilter ? age == ageFilter : true;
        const matchesCity = cityFilter ? description.includes(cityFilter) : true;

        if (matchesBreed && matchesAge && matchesCity) {
            petDiv.style.display = "block";
        } else {
            petDiv.style.display = "none";
        }
    });
}

// Add event listeners for filtering
document.getElementById("filter-button").addEventListener("click", applyFilters);
document.getElementById("clear-filters").addEventListener("click", () => {
    document.getElementById("filter-breed").value = "";
    document.getElementById("filter-age").value = "";
    document.getElementById("filter-city").value = "";
    applyFilters();
});

// Load pets when the page loads
document.addEventListener("DOMContentLoaded", loadPets);


async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];
            document.getElementById("wallet-address").innerText = `Wallet Address: ${walletAddress}`;
            console.log("Wallet connected:", walletAddress);
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Could not connect wallet. Please try again.");
        }
    } else {
        alert("MetaMask is not installed. Please install MetaMask and try again.");
    }
}

// Attach the connect function to the button
document.getElementById("connect-wallet").addEventListener("click", connectWallet);
