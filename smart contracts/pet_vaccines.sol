// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PetVaccineRecord {
    struct VaccineRecord {
        uint256 petId;
        string vaccineName; // Name of the vaccine
        uint256 dateAdministered; // Date the vaccine was given (UNIX timestamp)
        uint256 nextDueDate; // Next due date for the vaccine (optional, UNIX timestamp)
        address veterinarian; // Address of the veterinarian who administered the vaccine
    }

    mapping(uint256 => VaccineRecord[]) public vaccineRecords; // Maps petId to an array of vaccine records

    event VaccineRecordAdded(uint256 petId, string vaccineName, uint256 dateAdministered, uint256 nextDueDate, address veterinarian);

    // Modifier to validate veterinarian's address
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }

    // Function to add a vaccine record for a pet
    function addVaccineRecord(
        uint256 _petId,
        string memory _vaccineName,
        uint256 _dateAdministered,
        uint256 _nextDueDate
    ) public validAddress(msg.sender) {
        require(_dateAdministered <= block.timestamp, "Date cannot be in the future");
        if (_nextDueDate > 0) {
            require(_nextDueDate > _dateAdministered, "Next due date must be after the administration date");
        }

        VaccineRecord memory newRecord = VaccineRecord({
            petId: _petId,
            vaccineName: _vaccineName,
            dateAdministered: _dateAdministered,
            nextDueDate: _nextDueDate,
            veterinarian: msg.sender
        });

        vaccineRecords[_petId].push(newRecord);

        emit VaccineRecordAdded(_petId, _vaccineName, _dateAdministered, _nextDueDate, msg.sender);
    }

    // Function to get all vaccine records for a pet
    function getVaccineRecords(uint256 _petId) public view returns (VaccineRecord[] memory) {
        return vaccineRecords[_petId];
    }

    // Function to get a specific vaccine record by index
    function getVaccineRecordByIndex(uint256 _petId, uint256 _index) public view returns (VaccineRecord memory) {
        require(_index < vaccineRecords[_petId].length, "Index out of range");
        return vaccineRecords[_petId][_index];
    }
}
