// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./interfaces/IMarketplace.sol";
import "./interfaces/IEnergyToken.sol";
import "./EnergyToken.sol";
import "./PricingOracle.sol";

/**
 * @title Marketplace
 * @notice P2P marketplace for trading solar energy tokens
 */
contract Marketplace is 
    IMarketplace,
    AccessControl, 
    Pausable, 
    ReentrancyGuard,
    ERC1155Holder 
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant ARBITER_ROLE = keccak256("ARBITER_ROLE");

    IEnergyToken public immutable energyToken;
    PricingOracle public pricingOracle;

    uint256 private _listingCounter;
    uint256 private _orderCounter;

    // Platform fee in basis points (100 = 1%)
    uint256 public platformFeeBps = 25; // 0.25%
    
    // Minimum listing duration (1 hour)
    uint256 public constant MIN_DURATION = 1 hours;
    
    // Maximum listing duration (30 days)
    uint256 public constant MAX_DURATION = 30 days;
    
    // Escrow period after delivery confirmation
    uint256 public constant ESCROW_PERIOD = 24 hours;

    // Listing ID => Listing details
    mapping(uint256 => Listing) private _listings;
    
    // Order ID => Order details
    mapping(uint256 => Order) private _orders;
    
    // Seller address => active listing IDs
    mapping(address => uint256[]) private _sellerListings;
    
    // Buyer address => order IDs
    mapping(address => uint256[]) private _buyerOrders;
    
    // Grid zone => listing IDs
    mapping(uint256 => uint256[]) private _zoneListings;
    
    // Order ID => escrow release timestamp
    mapping(uint256 => uint256) private _escrowRelease;
    
    // Accumulated platform fees
    uint256 public accumulatedFees;

    constructor(address _energyToken, address _pricingOracle) {
        require(_energyToken != address(0), "Marketplace: Invalid token address");
        
        energyToken = IEnergyToken(_energyToken);
        pricingOracle = PricingOracle(_pricingOracle);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Create a new energy listing
     * @param tokenId Energy token ID to list
     * @param kWhAmount Amount of energy to sell
     * @param pricePerKwh Base price per kWh in wei
     * @param duration Listing duration in seconds
     */
    function createListing(
        uint256 tokenId,
        uint256 kWhAmount,
        uint256 pricePerKwh,
        uint256 duration
    ) external override whenNotPaused nonReentrant returns (uint256) {
        require(kWhAmount > 0, "Marketplace: Invalid amount");
        require(pricePerKwh > 0, "Marketplace: Invalid price");
        require(duration >= MIN_DURATION && duration <= MAX_DURATION, "Marketplace: Invalid duration");
        
        // Verify seller owns the tokens
        require(
            IERC1155(address(energyToken)).balanceOf(msg.sender, tokenId) >= kWhAmount,
            "Marketplace: Insufficient token balance"
        );
        
        // Get energy credit details
        IEnergyToken.EnergyCredit memory credit = energyToken.getEnergyCredit(tokenId);
        require(!credit.isConsumed, "Marketplace: Energy already consumed");
        
        // Transfer tokens to marketplace escrow
        IERC1155(address(energyToken)).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            kWhAmount,
            ""
        );

        _listingCounter++;
        uint256 listingId = _listingCounter;

        _listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            tokenId: tokenId,
            kWhAmount: kWhAmount,
            pricePerKwh: pricePerKwh,
            gridZone: credit.gridZone,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + duration,
            isActive: true
        });

        _sellerListings[msg.sender].push(listingId);
        _zoneListings[credit.gridZone].push(listingId);

        emit ListingCreated(listingId, msg.sender, tokenId, kWhAmount, pricePerKwh);
        
        return listingId;
    }

    /**
     * @notice Purchase energy from a listing
     * @param listingId Listing to purchase from
     * @param kWhAmount Amount of energy to purchase
     */
    function purchaseEnergy(
        uint256 listingId, 
        uint256 kWhAmount
    ) external payable override whenNotPaused nonReentrant returns (uint256) {
        Listing storage listing = _listings[listingId];
        
        require(listing.isActive, "Marketplace: Listing not active");
        require(block.timestamp < listing.expiresAt, "Marketplace: Listing expired");
        require(kWhAmount > 0 && kWhAmount <= listing.kWhAmount, "Marketplace: Invalid amount");
        require(msg.sender != listing.seller, "Marketplace: Cannot buy own listing");

        // Calculate dynamic price
        uint256 dynamicPrice = pricingOracle.calculateDynamicPrice(
            listing.pricePerKwh,
            listing.gridZone
        );
        
        uint256 totalCost = (dynamicPrice * kWhAmount) / 1e18;
        require(msg.value >= totalCost, "Marketplace: Insufficient payment");

        _orderCounter++;
        uint256 orderId = _orderCounter;

        _orders[orderId] = Order({
            orderId: orderId,
            listingId: listingId,
            buyer: msg.sender,
            seller: listing.seller,
            kWhAmount: kWhAmount,
            totalPrice: totalCost,
            createdAt: block.timestamp,
            status: OrderStatus.PENDING
        });

        // Update listing
        listing.kWhAmount -= kWhAmount;
        if (listing.kWhAmount == 0) {
            listing.isActive = false;
        }

        _buyerOrders[msg.sender].push(orderId);

        // Refund excess payment
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }

        // Transfer tokens to buyer immediately (tokens held in escrow by Marketplace)
        IERC1155(address(energyToken)).safeTransferFrom(
            address(this),
            msg.sender,
            listing.tokenId,
            kWhAmount,
            ""
        );

        emit OrderCreated(orderId, listingId, msg.sender, kWhAmount, totalCost);
        
        return orderId;
    }

    /**
     * @notice Confirm energy delivery (called by oracle)
     * @param orderId Order to confirm
     */
    /**
     * @notice Consume energy and release funds (Step 5)
     * @param orderId Order to consume
     */
    function consumeEnergy(uint256 orderId) external override nonReentrant {
        Order storage order = _orders[orderId];
        require(msg.sender == order.buyer, "Marketplace: Not buyer");
        require(order.status == OrderStatus.PENDING, "Marketplace: Invalid status");

        Listing storage listing = _listings[order.listingId];

        // Consume (Burn) tokens from buyer
        // Requires buyer to setApprovalForAll for Marketplace on EnergyToken
        // We cast to EnergyToken concrete contract to access consumeEnergyFrom
        EnergyToken(address(energyToken)).consumeEnergyFrom(
            msg.sender, 
            listing.tokenId, 
            order.kWhAmount
        );

        order.status = OrderStatus.COMPLETED;

        // Release funds (Step 5: Escrow release)
        uint256 fee = (order.totalPrice * platformFeeBps) / 10000;
        uint256 sellerAmount = order.totalPrice - fee;
        accumulatedFees += fee;

        payable(order.seller).transfer(sellerAmount);

        _updateReputation(order.seller, true);

        emit OrderCompleted(orderId, order.buyer, order.seller, order.kWhAmount);
        emit OrderStatusChanged(orderId, OrderStatus.COMPLETED);
    }

    /**
     * @notice Cancel a listing (seller only)
     * @param listingId Listing to cancel
     */
    function cancelListing(uint256 listingId) external override nonReentrant {
        Listing storage listing = _listings[listingId];
        require(listing.seller == msg.sender, "Marketplace: Not seller");
        require(listing.isActive, "Marketplace: Already inactive");

        listing.isActive = false;

        // Return tokens to seller
        IERC1155(address(energyToken)).safeTransferFrom(
            address(this),
            msg.sender,
            listing.tokenId,
            listing.kWhAmount,
            ""
        );

        emit ListingCancelled(listingId);
    }

    /**
     * @notice Raise a dispute on an order
     * @param orderId Order to dispute
     * @param reason Reason for dispute
     */
    function raiseDispute(uint256 orderId, string calldata reason) external {
        Order storage order = _orders[orderId];
        require(
            msg.sender == order.buyer || msg.sender == order.seller,
            "Marketplace: Not party to order"
        );
        require(
            order.status == OrderStatus.PENDING || order.status == OrderStatus.DELIVERED,
            "Marketplace: Cannot dispute"
        );

        order.status = OrderStatus.DISPUTED;
        
        emit DisputeRaised(orderId, msg.sender, reason);
        emit OrderStatusChanged(orderId, OrderStatus.DISPUTED);
    }

    /**
     * @notice Resolve a dispute (arbiter only)
     * @param orderId Order with dispute
     * @param refundBuyer Whether to refund the buyer
     */
    function resolveDispute(
        uint256 orderId, 
        bool refundBuyer
    ) external onlyRole(ARBITER_ROLE) nonReentrant {
        Order storage order = _orders[orderId];
        require(order.status == OrderStatus.DISPUTED, "Marketplace: Not disputed");

        if (refundBuyer) {
            order.status = OrderStatus.REFUNDED;
            
            // Return tokens to marketplace (or seller)
            // Refund buyer
            payable(order.buyer).transfer(order.totalPrice);
            
            _updateReputation(order.seller, false);
        } else {
            order.status = OrderStatus.COMPLETED;
            
            uint256 fee = (order.totalPrice * platformFeeBps) / 10000;
            uint256 sellerAmount = order.totalPrice - fee;
            accumulatedFees += fee;
            
            payable(order.seller).transfer(sellerAmount);
        }

        emit OrderStatusChanged(orderId, order.status);
    }

    /**
     * @notice Update listing price
     * @param listingId Listing to update
     * @param newPricePerKwh New price per kWh
     */
    function updateListingPrice(
        uint256 listingId, 
        uint256 newPricePerKwh
    ) external {
        Listing storage listing = _listings[listingId];
        require(listing.seller == msg.sender, "Marketplace: Not seller");
        require(listing.isActive, "Marketplace: Listing not active");
        require(newPricePerKwh > 0, "Marketplace: Invalid price");

        listing.pricePerKwh = newPricePerKwh;

        emit ListingUpdated(listingId, newPricePerKwh, listing.kWhAmount);
    }

    // Internal functions
    function _updateReputation(address seller, bool positive) internal {
        uint256 currentRep = energyToken.producerReputation(seller);
        uint256 newRep;
        
        if (positive) {
            newRep = currentRep < 95 ? currentRep + 5 : 100;
        } else {
            newRep = currentRep > 10 ? currentRep - 10 : 0;
        }
        
        // Note: This would need MARKETPLACE_ROLE on EnergyToken
        // energyToken.updateReputation(seller, newRep);
    }

    // View functions
    function getListing(uint256 listingId) external view override returns (Listing memory) {
        return _listings[listingId];
    }

    function getOrder(uint256 orderId) external view override returns (Order memory) {
        return _orders[orderId];
    }

    function getSellerListings(address seller) external view returns (uint256[] memory) {
        return _sellerListings[seller];
    }

    function getBuyerOrders(address buyer) external view returns (uint256[] memory) {
        return _buyerOrders[buyer];
    }

    function getZoneListings(uint256 gridZone) external view returns (uint256[] memory) {
        return _zoneListings[gridZone];
    }

    function getActiveListings(uint256 offset, uint256 limit) external view returns (Listing[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _listingCounter && count < limit; i++) {
            if (_listings[i].isActive && block.timestamp < _listings[i].expiresAt) {
                count++;
            }
        }
        
        Listing[] memory activeListings = new Listing[](count);
        uint256 index = 0;
        
        for (uint256 i = offset + 1; i <= _listingCounter && index < limit; i++) {
            if (_listings[i].isActive && block.timestamp < _listings[i].expiresAt) {
                activeListings[index] = _listings[i];
                index++;
            }
        }
        
        return activeListings;
    }

    function getListingCounter() external view returns (uint256) {
        return _listingCounter;
    }

    function getOrderCounter() external view returns (uint256) {
        return _orderCounter;
    }

    // Admin functions
    function setPlatformFee(uint256 newFeeBps) external onlyRole(ADMIN_ROLE) {
        require(newFeeBps <= 500, "Marketplace: Fee too high"); // Max 5%
        platformFeeBps = newFeeBps;
    }

    function setPricingOracle(address _pricingOracle) external onlyRole(ADMIN_ROLE) {
        pricingOracle = PricingOracle(_pricingOracle);
    }

    function withdrawFees(address to) external onlyRole(ADMIN_ROLE) {
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;
        payable(to).transfer(amount);
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // Required for ERC1155 receiver
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl, ERC1155Holder)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    receive() external payable {}
}
