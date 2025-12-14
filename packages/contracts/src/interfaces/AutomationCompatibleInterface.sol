// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AutomationCompatibleInterface
 * @notice Interface for Chainlink Automation compatible contracts
 */
interface AutomationCompatibleInterface {
    /**
     * @notice Method called by Chainlink Automation nodes to check if upkeep is needed
     * @param checkData Data passed from the check upkeep registration
     * @return upkeepNeeded Boolean indicating whether upkeep is needed
     * @return performData Data to pass to performUpkeep if upkeep is needed
     */
    function checkUpkeep(bytes calldata checkData)
        external
        returns (bool upkeepNeeded, bytes memory performData);

    /**
     * @notice Method called by Chainlink Automation nodes to perform upkeep
     * @param performData Data returned from checkUpkeep
     */
    function performUpkeep(bytes calldata performData) external;
}
