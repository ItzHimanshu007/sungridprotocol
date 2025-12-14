// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMarketplace {
    struct Listing {
        uint256 listingId;
        address seller;
        uint256 tokenId;
        uint256 kWhAmount;
        uint256 pricePerKwh;
        uint256 gridZone;
        uint256 createdAt;
        uint256 expiresAt;
        bool isActive;
    }

    struct Order {
        uint256 orderId;
        uint256 listingId;
        address buyer;
        address seller;
        uint256 kWhAmount;
        uint256 totalPrice;
        uint256 createdAt;
        OrderStatus status;
    }

    enum OrderStatus { 
        PENDING, 
        CONFIRMED, 
        DELIVERED, 
        COMPLETED, 
        DISPUTED, 
        CANCELLED, 
        REFUNDED 
    }

    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        uint256 tokenId,
        uint256 kWhAmount,
        uint256 pricePerKwh
    );
    
    event ListingUpdated(uint256 indexed listingId, uint256 newPrice, uint256 newAmount);
    event ListingCancelled(uint256 indexed listingId);
    
    event OrderCreated(
        uint256 indexed orderId,
        uint256 indexed listingId,
        address indexed buyer,
        uint256 kWhAmount,
        uint256 totalPrice
    );
    
    event OrderStatusChanged(uint256 indexed orderId, OrderStatus newStatus);
    event OrderCompleted(uint256 indexed orderId, address buyer, address seller, uint256 amount);
    event DisputeRaised(uint256 indexed orderId, address raisedBy, string reason);

    function createListing(
        uint256 tokenId,
        uint256 kWhAmount,
        uint256 pricePerKwh,
        uint256 duration
    ) external returns (uint256);
    
    function purchaseEnergy(uint256 listingId, uint256 kWhAmount) external payable returns (uint256);
    function consumeEnergy(uint256 orderId) external;
    function cancelListing(uint256 listingId) external;
    function getListing(uint256 listingId) external view returns (Listing memory);
    function getOrder(uint256 orderId) external view returns (Order memory);
}
