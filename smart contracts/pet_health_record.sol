// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PetHealthRecord {
    struct HealthRecord {
        uint256 petId;
        string description; // Description of the health event or record
        uint256 date; // Date of the record (UNIX timestamp)
        address veterinarian; // Address of the veterinarian who created the record
    }

    mapping(uint256 => HealthRecord[]) public healthRecords; // Maps petId to an array of health records

    event HealthRecordAdded(uint256 petId, string description, uint256 date, address veterinarian);

    // Modifier to validate veterinarian's address (e.g., non-zero address)
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }

    // Function to add a new health record for a pet
    function addHealthRecord(
        uint256 _petId,
        string memory _description,
        uint256 _date
    ) public validAddress(msg.sender) {
        require(_date <= block.timestamp, "Date cannot be in the future");

        HealthRecord memory newRecord = HealthRecord({
            petId: _petId,
            description: _description,
            date: _date,
            veterinarian: msg.sender
        });

        healthRecords[_petId].push(newRecord);

        emit HealthRecordAdded(_petId, _description, _date, msg.sender);
    }

    // Function to get all health records of a pet
    function getHealthRecords(uint256 _petId) public view returns (HealthRecord[] memory) {
        return healthRecords[_petId];
    }

    // Function to get a specific health record by index
    function getHealthRecordByIndex(uint256 _petId, uint256 _index) public view returns (HealthRecord memory) {
        require(_index < healthRecords[_petId].length, "Index out of range");
        return healthRecords[_petId][_index];
    }
}
