// Connect to Web3 instance and contract
const web3 = new Web3(window.ethereum || "http://127.0.0.1:7545");

const contractABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "deletePet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "PetDeleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "breed",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "age",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "vaccination",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "photo",
                "type": "string"
            }
        ],
        "name": "PetRegistered",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "breed",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "age",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "vaccination",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "photo",
                "type": "string"
            }
        ],
        "name": "registerPet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getPet",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPetCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "pets",
        "outputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "breed",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "age",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "vaccination",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "photo",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress = "0xD4Fc541236927E2EAf8F27606bD7309C1Fc2cbee";
const contract = new web3.eth.Contract(contractABI, contractAddress);


window.ethereum.on('accountsChanged', (accounts) => {
    // Reload the page or update the UI with the new account
    if (accounts.length > 0) {
        console.log("New account selected:", accounts[0]);
        loadPets(); // Reload pets for the new account
    } else {
        alert("No accounts connected.");
    }
});

// Register Pet Function
async function registerPet() {
    try {
        const breed = document.getElementById("breed").value.trim();
        const age = parseInt(document.getElementById("age").value);
        const description = document.getElementById("description").value.trim();
        const photo = document.getElementById("photo").value.trim();

        // Handle multiple vaccination choices
        const vaccinations = [];
        if (document.getElementById("vaccination1").checked) vaccinations.push("Vaccine 1");
        if (document.getElementById("vaccination2").checked) vaccinations.push("Vaccine 2");
        if (document.getElementById("vaccination3").checked) vaccinations.push("Vaccine 3");
        const vaccination = vaccinations.join(", ");

        // Validation
        if (!breed || !age || !description || !photo) {
            alert("Please fill out all fields.");
            return;
        }

        const accounts = await web3.eth.getAccounts();
        const currentAccount = accounts[0]; // Use the currently selected MetaMask account

        const tx = await contract.methods.registerPet(breed, age, description, vaccination, photo)
            .send({ from: currentAccount, gas: 300000 });

        console.log("Transaction successful:", tx);
        alert("Pet registered successfully.");
        loadPets(); // Reload pets after registration
    } catch (error) {
        console.error("Error registering pet:", error);
        alert("Error registering pet. Check the console for details.");
    }
}

async function loadPets() {
    try {
        const petsCount = await contract.methods.getPetCount().call();
        console.log(`Total pets registered: ${petsCount}`);

        const petsList = document.getElementById("pets-list");
        petsList.innerHTML = ""; // Clear existing content

        if (petsCount === 0) {
            petsList.innerHTML = "<p>No pets found.</p>";
            return;
        }

        for (let i = 0; i < petsCount; i++) {
            const pet = await contract.methods.getPet(i).call();
            console.log(`Pet ${i}:`, pet);

            const petDiv = document.createElement("div");
            petDiv.classList.add("animal-item");

            petDiv.innerHTML = `
                <img src="${pet[5]}" alt="${pet[1]}" class="animal-photo" style="width: 150px; height: 150px;">
                <h3>${pet[1]}</h3>
                <p><strong>Breed:</strong> ${pet[1]}</p>
                <p><strong>Age:</strong> ${pet[2]} years</p>
                <p><strong>Description:</strong> ${pet[3]}</p>
                <a href="view_animal.php?id=${i}" class="view-button" style="text-decoration: none; color: white; background-color: #007bff; padding: 5px 10px; border-radius: 5px;">View</a>
            `;
            petsList.appendChild(petDiv);
        }
    } catch (error) {
        console.error("Error loading pets:", error);
        document.getElementById("pets-list").innerHTML = "<p>Error loading pets.</p>";
    }
}


// Listen for PetRegistered Events
contract.events.PetRegistered({})
    .on("data", (event) => {
        console.log("PetRegistered event received:", event);
        loadPets(); // Reload pets when the event is received
    })
    .on("error", (error) => {
        console.error("Error receiving PetRegistered event:", error);
    });

// Call LoadPets on Page Load
document.addEventListener("DOMContentLoaded", async () => {
    loadPets();
    document.getElementById("register-button").onclick = registerPet;
});



