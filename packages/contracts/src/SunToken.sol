// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title SunToken
 * @notice The native utility currency of the SunGrid Protocol
 * @dev Users earn this by selling energy and use it to buy energy or vote.
 */
contract SunToken is ERC20, ERC20Burnable, AccessControl, ERC20Permit {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("SunGrid Token", "SUN") ERC20Permit("SunGrid Token") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        
        // Initial Supply: 10 Million Tokens to the deployer
        _mint(msg.sender, 10000000 * 10 ** decimals());
    }

    /**
     * @notice Mint new tokens (Restricted to Minter Role)
     * @dev Used for rewards, faucets, or liquidity incentives
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}
