/*
 * SPDX-License-Identifier: MIT
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";

contract TNFT is ERC721A, Ownable {

    string public baseURI;

    constructor(string memory name_, string memory symbol_)
        ERC721A(name_, symbol_)
    {
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        baseURI = baseURI_;
    }

    function mint(uint quantity) external {
        require(quantity <= 5, "mint too many");
        _safeMint(msg.sender, quantity);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

}