// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HangoutMintPass is Ownable, ERC721 {

    uint256 public totalMaxSupply = 10000;
    uint256 public totalSupply;
    string public baseURI;

    constructor()
        ERC721("Hangout Mint Pass", "Hangout Mint Pass")
    {
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        baseURI = baseURI_;
    }

    function mint(address[] calldata recipients, uint256[] calldata quantities) external onlyOwner {
        require(recipients.length == quantities.length, "length dont match");
        for (uint i = 0; i < recipients.length; i++) {
            require(totalSupply + quantities[i] <= totalMaxSupply, "mint too many");
            for (uint256 j = 0; j < quantities[i]; j++) {
                _mint(recipients[i], totalSupply + j);
            }

            totalSupply += quantities[i];
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}