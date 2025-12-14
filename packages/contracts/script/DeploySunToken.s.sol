// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/SunToken.sol";

contract DeploySunToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        SunToken sunToken = new SunToken();
        
        console.log("SunToken deployed to:", address(sunToken));

        vm.stopBroadcast();
    }
}
