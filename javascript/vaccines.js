const contractAddress = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B"; 
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

async function initializeWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert("Please install MetaMask to use this feature.");
    }
}

// Function to add a vaccine record
async function addVaccineRecord(petId, vaccineName, dateAdministered, nextDueDate) {
    try {
        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0];

        await contract.methods.addVaccineRecord(petId, vaccineName, dateAdministered, nextDueDate)
            .send({ from: sender });

        alert("Vaccine record added successfully!");
    } catch (error) {
        console.error("Error adding vaccine record:", error);
        alert("Failed to add vaccine record. Check console for details.");
    }
}

// Function to fetch vaccine records for a specific pet
async function getVaccineRecords(petId) {
    try {
        const records = await contract.methods.getVaccineRecords(petId).call();
        return records;
    } catch (error) {
        console.error("Error fetching vaccine records:", error);
        return [];
    }
}

// Function to fetch and display vaccine records for a pet
async function displayVaccineRecords(petId) {
    const records = await getVaccineRecords(petId);

    const container = document.getElementById("vaccine-records-container");
    container.innerHTML = "";

    if (records.length === 0) {
        container.innerHTML = "<p>No vaccine records found for this pet.</p>";
        return;
    }

    records.forEach(record => {
        const recordElement = document.createElement("div");
        recordElement.className = "vaccine-record";
        recordElement.innerHTML = `
            <p>Vaccine Name: ${record.vaccineName}</p>
            <p>Date Administered: ${new Date(record.dateAdministered * 1000).toLocaleDateString()}</p>
            <p>Next Due Date: ${record.nextDueDate ? new Date(record.nextDueDate * 1000).toLocaleDateString() : "N/A"}</p>
            <p>Veterinarian: ${record.veterinarian}</p>
        `;
        container.appendChild(recordElement);
    });
}

// Event listener for adding a vaccine record
document.addEventListener("DOMContentLoaded", () => {
    initializeWeb3();

    document.getElementById("add-vaccine-button").onclick = async () => {
        const petId = document.getElementById("pet-id").value;
        const vaccineName = document.getElementById("vaccine-name").value;
        const dateAdministered = Math.floor(new Date(document.getElementById("date-administered").value).getTime() / 1000);
        const nextDueDate = document.getElementById("next-due-date").value
            ? Math.floor(new Date(document.getElementById("next-due-date").value).getTime() / 1000)
            : 0;

        if (!petId || !vaccineName || !dateAdministered) {
            alert("Please fill in all required fields.");
            return;
        }

        await addVaccineRecord(petId, vaccineName, dateAdministered, nextDueDate);
    };
});
