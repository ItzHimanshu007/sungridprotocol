// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IEnergyToken.sol";

/**
 * @title EnergyToken
 * @notice ERC1155 token representing verified solar energy credits
 * @dev 1 token = 1 kWh of renewable energy
 */
contract EnergyToken is 
    ERC1155, 
    ERC1155Burnable, 
    ERC1155Supply,
    AccessControl, 
    Pausable,
    ReentrancyGuard,
    IEnergyToken 
{
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MARKETPLACE_ROLE = keccak256("MARKETPLACE_ROLE");

    uint256 private _currentTokenId;
    
    // Token ID => Energy Credit details
    mapping(uint256 => EnergyCredit) private _energyCredits;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;
    
    // Producer address => is verified
    mapping(address => bool) private _verifiedProducers;
    
    // Producer address => meter ID
    mapping(address => uint256) private _producerMeters;
    
    // Producer address => total energy produced (lifetime)
    mapping(address => uint256) public producerTotalEnergy;
    
    // Producer address => reputation score (0-100)
    mapping(address => uint256) public producerReputation;
    
    // Grid zone => total energy available
    mapping(uint256 => uint256) public gridZoneSupply;

    // Minimum minting amount (0.1 kWh in wei units)
    uint256 public constant MIN_MINT_AMOUNT = 0.1 ether;
    
    // Maximum minting amount per transaction (1000 kWh)
    uint256 public constant MAX_MINT_AMOUNT = 1000 ether;

    constructor(string memory uri_) ERC1155(uri_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Get URI for a specific token
     * @param tokenId Token ID
     */
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        string memory tokenURI = _tokenURIs[tokenId];
        // If specific URI is set, return it, otherwise return default batch URI
        if (bytes(tokenURI).length > 0) {
            return tokenURI;
        }
        return super.uri(tokenId);
    }

    /**
     * @notice Mint new energy tokens based on verified production
     * @param producer Address of the energy producer
     * @param kWhAmount Amount of energy in kWh (use 1e18 for 1 kWh)
     * @param gridZone Geographic grid zone identifier
     * @param tokenURI IPFS URI for metadata (e.g. ipfs://CID)
     */
    function mintEnergy(
        address producer,
        uint256 kWhAmount,
        uint256 gridZone,
        string memory tokenURI
    ) external override whenNotPaused nonReentrant returns (uint256) {
        require(msg.sender == producer || hasRole(ORACLE_ROLE, msg.sender), "EnergyToken: Not producer or oracle");
        require(_verifiedProducers[producer], "EnergyToken: Producer not verified");
        require(kWhAmount >= MIN_MINT_AMOUNT, "EnergyToken: Amount too small");
        require(kWhAmount <= MAX_MINT_AMOUNT, "EnergyToken: Amount too large");
        require(gridZone > 0, "EnergyToken: Invalid grid zone");

        _currentTokenId++;
        uint256 newTokenId = _currentTokenId;

        _energyCredits[newTokenId] = EnergyCredit({
            producer: producer,
            kWhAmount: kWhAmount,
            timestamp: block.timestamp,
            gridZone: gridZone,
            isGreen: true,
            isConsumed: false
        });

        if (bytes(tokenURI).length > 0) {
            _tokenURIs[newTokenId] = tokenURI;
        }

        _mint(producer, newTokenId, kWhAmount, "");
        
        producerTotalEnergy[producer] += kWhAmount;
        gridZoneSupply[gridZone] += kWhAmount;

        emit EnergyMinted(newTokenId, producer, kWhAmount, gridZone);
        
        return newTokenId;
    }

    /**
     * @notice Mark energy as consumed (burned)
     * @param tokenId Token ID to consume
     * @param amount Amount to consume
     */
    function consumeEnergy(
        uint256 tokenId, 
        uint256 amount
    ) external override whenNotPaused nonReentrant {
        _consumeEnergy(msg.sender, tokenId, amount);
    }

    /**
     * @notice Mark energy as consumed (burned) from a specific account (requires approval)
     * @param account Account to burn from
     * @param tokenId Token ID to consume
     * @param amount Amount to consume
     */
    function consumeEnergyFrom(
        address account,
        uint256 tokenId,
        uint256 amount
    ) external whenNotPaused nonReentrant {
        require(
            account == msg.sender || isApprovedForAll(account, msg.sender),
            "EnergyToken: Caller is not owner nor approved"
        );
        _consumeEnergy(account, tokenId, amount);
    }

    function _consumeEnergy(address account, uint256 tokenId, uint256 amount) internal {
        require(balanceOf(account, tokenId) >= amount, "EnergyToken: Insufficient balance");
        
        EnergyCredit storage credit = _energyCredits[tokenId];
        require(!credit.isConsumed, "EnergyToken: Already consumed");
        
        _burn(account, tokenId, amount);
        
        if (balanceOf(account, tokenId) == 0) {
            credit.isConsumed = true;
        }
        
        gridZoneSupply[credit.gridZone] -= amount;

        emit EnergyConsumed(tokenId, account, amount);
    }

    /**
     * @notice Register a new verified producer
     * @param producer Address of the producer
     * @param meterId Smart meter ID
     */
    function registerProducer(
        address producer, 
        uint256 meterId
    ) external override onlyRole(ADMIN_ROLE) {
        require(producer != address(0), "EnergyToken: Invalid producer address");
        require(!_verifiedProducers[producer], "EnergyToken: Already registered");
        require(meterId > 0, "EnergyToken: Invalid meter ID");

        _verifiedProducers[producer] = true;
        _producerMeters[producer] = meterId;
        producerReputation[producer] = 50; // Start with neutral reputation

        emit ProducerRegistered(producer, meterId);
    }

    /**
     * @notice Remove a producer from verified list
     * @param producer Address of the producer
     */
    function deregisterProducer(address producer) external onlyRole(ADMIN_ROLE) {
        require(_verifiedProducers[producer], "EnergyToken: Not registered");
        
        _verifiedProducers[producer] = false;
        delete _producerMeters[producer];

        emit ProducerDeregistered(producer);
    }

    /**
     * @notice Update producer reputation
     * @param producer Address of the producer
     * @param newScore New reputation score (0-100)
     */
    function updateReputation(
        address producer, 
        uint256 newScore
    ) external onlyRole(MARKETPLACE_ROLE) {
        require(newScore <= 100, "EnergyToken: Invalid score");
        producerReputation[producer] = newScore;
    }

    // View functions
    function getEnergyCredit(uint256 tokenId) external view override returns (EnergyCredit memory) {
        return _energyCredits[tokenId];
    }

    function isVerifiedProducer(address producer) external view override returns (bool) {
        return _verifiedProducers[producer];
    }

    function getProducerMeter(address producer) external view returns (uint256) {
        return _producerMeters[producer];
    }

    function getCurrentTokenId() external view returns (uint256) {
        return _currentTokenId;
    }

    // Admin functions
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function setURI(string memory newuri) external onlyRole(ADMIN_ROLE) {
        _setURI(newuri);
    }

    // Required overrides
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
