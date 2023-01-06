/*
 * SPDX-License-Identifier: MIT
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract TMerkleTree {

    bytes32 public root1k;
    bytes32 public root10k;
    uint public times;


    constructor()
    {
    }

    function setRoots(bytes32 root1k_, bytes32 root10k_) external {
        root1k = root1k_;
        root10k = root10k_;
    }

    function check1k(bytes32[] memory proof) external {
        require(MerkleProof.verify(proof, root1k, bytes32(uint256(uint160(msg.sender)))), "invalid proof");
        times++;
    }

    function check10k(bytes32[] memory proof) external {
        require(MerkleProof.verify(proof, root10k, bytes32(uint256(uint160(msg.sender)))), "invalid proof");
        times++;
    }
}