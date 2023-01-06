// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "hardhat/console.sol";

contract SignVerify {

    address public immutable singer;

    constructor(address _signer) {
        singer = _signer;
    }

//    function verify(bytes memory signature) external {
////        console.log("sender:", msg.sender);
//        bytes memory encodedBytes = abi.encode(msg.sender);
////        console.log("encodedBytes:", encodedBytes);
//        bytes32 hash = keccak256(encodedBytes);
//    }
}
