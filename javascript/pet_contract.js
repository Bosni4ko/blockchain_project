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

async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum || "http://127.0.0.1:7545");
        await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
        alert("MetaMask not detected. Please install MetaMask to interact with the blockchain.");
        return;
    }

    const accounts = await web3.eth.getAccounts();
    console.log("Connected account:", accounts[0]);

    contract = new web3.eth.Contract(contractABI, contractAddress);
}

// Register pet function
async function registerPet() {
    const species = document.getElementById("species").value;
    const breed = document.getElementById("breed").value;
    const sex = document.querySelector('input[name="sex"]:checked').value;
    const age = document.getElementById("age").value;
    const name = document.getElementById("name").value || "Unnamed Pet";
    const photo = document.getElementById("photo").value;
    const description = document.getElementById("description").value;
    const chipInfo = document.getElementById("chipInfo").value || "Chip Info Unavailable";
    const healthDescription = document.getElementById("healthDescription").value || "No health description provided";
    const breedingStatus = document.getElementById("breedingStatus").value;
    const fatherId = parseInt(document.getElementById("fatherId").value) || 0;
    const motherId = parseInt(document.getElementById("motherId").value) || 0;

    if (!species || !breed || !sex || !age || !photo || !description) {
        alert("Please fill out all required fields.");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        const birthDate = Math.floor(Date.now() / 1000) - age * 365 * 24 * 60 * 60;

        const tx = await contract.methods
            .registerPet(
                species,
                breed,
                sex,
                birthDate,
                name,
                photo,
                description,
                chipInfo,
                healthDescription,
                fatherId,
                motherId,
                breedingStatus
            )
            .send({ from: accounts[0] });

        console.log("Transaction successful:", tx);
        alert("Pet successfully registered!");
        document.getElementById("pet-registration-form").reset();
        document.getElementById("petRegistrationModal").style.display = "none";
    } catch (error) {
        console.error("Error registering pet:", error);
        alert("Failed to register pet. Please check the console for details.");
    }
}
async function updatePet() {
    const petId = parseInt(document.getElementById("petId").value);
    const name = document.getElementById("updateName").value || "Unnamed Pet";
    const photo = document.getElementById("updatePhoto").value || "";
    const description = document.getElementById("updateDescription").value || "";
    const chipInfo = document.getElementById("updateChipInfo").value || "Chip Info Unavailable";
    const healthDescription = document.getElementById("updateHealthDescription").value || "No health description provided";
    const breedingStatus = document.getElementById("updateBreedingStatus").value;

    if (!petId || !name || !photo || !description) {
        alert("Please fill out all required fields.");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();

        const tx = await contract.methods
            .updatePet(
                petId,
                name,
                photo,
                description,
                chipInfo,
                healthDescription,
                breedingStatus
            )
            .send({ from: accounts[0] });

        console.log("Transaction successful:", tx);
        alert("Pet information successfully updated!");
        document.getElementById("update-pet-form").reset();
    } catch (error) {
        console.error("Error updating pet:", error);
        alert("Failed to update pet. Please check the console for details.");
    }
}

async function transferOwnership() {
    const petId = parseInt(document.getElementById("transferPetId").value);
    const newOwner = document.getElementById("newOwnerAddress").value;

    if (!petId || !newOwner) {
        alert("Please fill out all required fields.");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();

        const tx = await contract.methods
            .transferOwnership(petId, newOwner)
            .send({ from: accounts[0] });

        console.log("Transaction successful:", tx);
        alert("Ownership successfully transferred!");
        document.getElementById("transfer-ownership-form").reset();
    } catch (error) {
        console.error("Error transferring ownership:", error);
        alert("Failed to transfer ownership. Please check the console for details.");
    }
}

// Initialize Web3 when the page loads
document.addEventListener("DOMContentLoaded", () => {
    initWeb3();
    console.log("Web3 initialized.");
});

// Retrieve pet function
async function retrievePet() {
    const petId = parseInt(document.getElementById("retrievePetId").value);

    if (!petId) {
        alert("Please enter a valid Pet ID.");
        return;
    }

    try {
        const pet = await contract.methods.getPet(petId).call();
        
        // Display pet information
        console.log("Retrieved Pet:", pet);
        const petDetails = `
            <h3>Pet Details</h3>
            <p><strong>Pet ID:</strong> ${pet.id}</p>
            <p><strong>Species:</strong> ${pet.species}</p>
            <p><strong>Breed:</strong> ${pet.breed}</p>
            <p><strong>Sex:</strong> ${pet.sex}</p>
            <p><strong>Birth Date:</strong> ${new Date(pet.birthDate * 1000).toLocaleDateString()}</p>
            <p><strong>Name:</strong> ${pet.name}</p>
            <p><strong>Description:</strong> ${pet.description}</p>
            <p><strong>Owner Address:</strong> ${pet.ownerId}</p>
            <p><strong>Chip Info:</strong> ${pet.chipInfo}</p>
            <p><strong>Health Description:</strong> ${pet.healthDescription}</p>
            <p><strong>Father ID:</strong> ${pet.fatherId}</p>
            <p><strong>Mother ID:</strong> ${pet.motherId}</p>
            <p><strong>Breeding Status:</strong> ${pet.breedingStatus}</p>
            <p><strong>Photo:</strong> <img src="${pet.photo}" alt="Pet Photo" style="max-width: 200px;"/></p>
        `;

        document.getElementById("petDetails").innerHTML = petDetails;
    } catch (error) {
        console.error("Error retrieving pet:", error);
        alert("Failed to retrieve pet. Please check the console for details.");
    }
}

// HTML Structure for Pet Retrieval
document.addEventListener("DOMContentLoaded", () => {
    initWeb3();
    console.log("Web3 initialized.");

    // Add a button click listener for retrieving pet details
    document.getElementById("retrievePetButton").addEventListener("click", retrievePet);
});