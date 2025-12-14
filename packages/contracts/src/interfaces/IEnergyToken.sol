// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEnergyToken {
    struct EnergyCredit {
        address producer;
        uint256 kWhAmount;
        uint256 timestamp;
        uint256 gridZone;
        bool isGreen;
        bool isConsumed;
    }

    event EnergyMinted(
        uint256 indexed tokenId,
        address indexed producer,
        uint256 kWhAmount,
        uint256 gridZone
    );
    
    event EnergyConsumed(
        uint256 indexed tokenId,
        address indexed consumer,
        uint256 kWhAmount
    );
    
    event ProducerRegistered(address indexed producer, uint256 meterId);
    event ProducerDeregistered(address indexed producer);

    function mintEnergy(
        address producer,
        uint256 kWhAmount,
        uint256 gridZone,
        string memory tokenURI
    ) external returns (uint256);
    
    function consumeEnergy(uint256 tokenId, uint256 amount) external;
    function getEnergyCredit(uint256 tokenId) external view returns (EnergyCredit memory);
    function registerProducer(address producer, uint256 meterId) external;
    function isVerifiedProducer(address producer) external view returns (bool);
    function producerReputation(address producer) external view returns (uint256);
    function updateReputation(address producer, uint256 newScore) external;
}
