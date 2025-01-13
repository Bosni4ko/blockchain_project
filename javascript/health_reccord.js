const contractAddress = "0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47"; 

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_petId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_vaccineName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_dateAdministered",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_nextDueDate",
				"type": "uint256"
			}
		],
		"name": "addVaccineRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "petId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "vaccineName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "dateAdministered",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "nextDueDate",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "veterinarian",
				"type": "address"
			}
		],
		"name": "VaccineRecordAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_petId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getVaccineRecordByIndex",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "petId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "vaccineName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "dateAdministered",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "nextDueDate",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "veterinarian",
						"type": "address"
					}
				],
				"internalType": "struct PetVaccineRecord.VaccineRecord",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_petId",
				"type": "uint256"
			}
		],
		"name": "getVaccineRecords",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "petId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "vaccineName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "dateAdministered",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "nextDueDate",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "veterinarian",
						"type": "address"
					}
				],
				"internalType": "struct PetVaccineRecord.VaccineRecord[]",
				"name": "",
				"type": "tuple[]"
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "vaccineRecords",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "petId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "vaccineName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "dateAdministered",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "nextDueDate",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "veterinarian",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];


let web3;
let contract;

// Initialize Web3 and the contract instance
async function initializeWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert("Please install MetaMask to use this feature.");
    }
}

// Function to add a health record
async function addHealthRecord(petId, description, date) {
    try {
        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0];

        await contract.methods.addHealthRecord(petId, description, date).send({ from: sender });

        alert("Health record added successfully!");
    } catch (error) {
        console.error("Error adding health record:", error);
        alert("Failed to add health record. Check console for details.");
    }
}

// Function to fetch all health records for a specific pet
async function getHealthRecords(petId) {
    try {
        const records = await contract.methods.getHealthRecords(petId).call();
        return records;
    } catch (error) {
        console.error("Error fetching health records:", error);
        return [];
    }
}

// Function to fetch and display health records for a pet
async function displayHealthRecords(petId) {
    const records = await getHealthRecords(petId);

    const container = document.getElementById("health-records-container");
    container.innerHTML = "";

    if (records.length === 0) {
        container.innerHTML = "<p>No health records found for this pet.</p>";
        return;
    }

    records.forEach(record => {
        const recordElement = document.createElement("div");
        recordElement.className = "health-record";
        recordElement.innerHTML = `
            <p>Description: ${record.description}</p>
            <p>Date: ${new Date(record.date * 1000).toLocaleDateString()}</p>
            <p>Veterinarian: ${record.veterinarian}</p>
        `;
        container.appendChild(recordElement);
    });
}

// Event listener for adding a health record
document.addEventListener("DOMContentLoaded", () => {
    initializeWeb3();

    document.getElementById("add-health-record-button").onclick = async () => {
        const petId = document.getElementById("pet-id").value;
        const description = document.getElementById("description").value;
        const date = Math.floor(new Date(document.getElementById("date").value).getTime() / 1000);

        if (!petId || !description || !date) {
            alert("Please fill in all required fields.");
            return;
        }

        await addHealthRecord(petId, description, date);
    };

    document.getElementById("fetch-health-records-button").onclick = async () => {
        const petId = document.getElementById("pet-id").value;

        if (!petId) {
            alert("Please enter a pet ID.");
            return;
        }

        await displayHealthRecords(petId);
    };
});
