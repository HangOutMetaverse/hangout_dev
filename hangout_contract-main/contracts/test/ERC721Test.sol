// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Test is ERC721 {

    uint totalSupply;

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
    {
    }

    function mint(uint quantity) external {
        for (uint i = 0; i < quantity; i++) {
            _mint(msg.sender, totalSupply+i);
        }

        totalSupply += quantity;
    }
}
