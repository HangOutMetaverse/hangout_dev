// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ERC1155Test is ERC1155 {
    constructor(string memory uri_)
        ERC1155(uri_)
    {
    }

    function mint(uint id, uint amount) external {
        _mint(msg.sender, id, amount, "");
    }
}
