// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PetRegistry {
    struct Pet {
        uint256 id;
        string species;
        string breed;
        string sex;
        uint256 birthDate;
        string name; // Optional, can be empty
        string photo; // URL or IPFS hash
        string description;
        address ownerId; // Address of the owner
        string chipInfo;
        string healthDescription;
        uint256 fatherId; // ID of the father (0 if unknown)
        uint256 motherId; // ID of the mother (0 if unknown)
        string breedingStatus; // e.g., "Eligible", "Neutered", etc.
    }

    mapping(uint256 => Pet) public pets; // Maps pet ID to Pet structure
    mapping(uint256 => bool) public registeredPets; // Tracks if a pet ID is already registered

    uint256 public nextPetId = 1; // Auto-incrementing ID for pets

    event PetRegistered(uint256 petId, string species, address ownerId);
    event PetUpdated(uint256 petId);
    event OwnershipTransferred(uint256 petId, address newOwner);

    modifier onlyOwner(uint256 petId) {
        require(registeredPets[petId], "Pet not registered");
        require(pets[petId].ownerId == msg.sender, "Not the pet owner");
        _;
    }

    // Function to register a new pet
    function registerPet(
        string memory _species,
        string memory _breed,
        string memory _sex,
        uint256 _birthDate,
        string memory _name,
        string memory _photo,
        string memory _description,
        string memory _chipInfo,
        string memory _healthDescription,
        uint256 _fatherId,
        uint256 _motherId,
        string memory _breedingStatus
    ) public {
        uint256 petId = nextPetId;
        nextPetId++;

        require(!registeredPets[petId], "Pet ID already registered");

        pets[petId] = Pet({
            id: petId,
            species: _species,
            breed: _breed,
            sex: _sex,
            birthDate: _birthDate,
            name: _name,
            photo: _photo,
            description: _description,
            ownerId: msg.sender,
            chipInfo: _chipInfo,
            healthDescription: _healthDescription,
            fatherId: _fatherId,
            motherId: _motherId,
            breedingStatus: _breedingStatus
        });

        registeredPets[petId] = true;
        emit PetRegistered(petId, _species, msg.sender);
    }

    // Function to update pet information
    function updatePet(
        uint256 _petId,
        string memory _name,
        string memory _photo,
        string memory _description,
        string memory _chipInfo,
        string memory _healthDescription,
        string memory _breedingStatus
    ) public onlyOwner(_petId) {
        Pet storage pet = pets[_petId];
        pet.name = _name;
        pet.photo = _photo;
        pet.description = _description;
        pet.chipInfo = _chipInfo;
        pet.healthDescription = _healthDescription;
        pet.breedingStatus = _breedingStatus;

        emit PetUpdated(_petId);
    }

    // Function to transfer ownership of a pet
    function transferOwnership(uint256 _petId, address _newOwner) public onlyOwner(_petId) {
        require(_newOwner != address(0), "Invalid new owner address");
        pets[_petId].ownerId = _newOwner;

        emit OwnershipTransferred(_petId, _newOwner);
    }

    // Function to get detailed information about a pet
    function getPet(uint256 _petId) public view returns (Pet memory) {
        require(registeredPets[_petId], "Pet not registered");
        return pets[_petId];
    }
}
