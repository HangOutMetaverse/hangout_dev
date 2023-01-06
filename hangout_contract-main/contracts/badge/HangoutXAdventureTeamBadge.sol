/*
 * SPDX-License-Identifier: MIT
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";

contract HangoutXAdventureTeamBadge is ERC721A, Ownable {

    string public baseURI;

    constructor()
        ERC721A("HANGOUT X Adventure Team Badge", "HOXATB")
    {
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        baseURI = baseURI_;
    }

    function mint(uint quantity) external onlyOwner {
        _safeMint(msg.sender, quantity);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

}