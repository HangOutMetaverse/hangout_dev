/*
 * SPDX-License-Identifier: MIT
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";

contract HangoutXAdventureTeamBadgeV2 is ERC721A, Ownable {

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

    function mintOneForMultiReceiver(address[] calldata receivers) external onlyOwner {
        for (uint i = 0; i < receivers.length; i++) {
            _safeMint(receivers[i], 1);
        }
    }

    function mintMultiForMultiReceiver(address[] calldata receivers, uint[] calldata quantities) external onlyOwner {
        require(receivers.length == quantities.length, 'length dont match');

        for (uint i = 0; i < receivers.length; i++) {
            _safeMint(receivers[i], quantities[i]);
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

}