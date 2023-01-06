// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract HangoutXmasCard is Ownable, ERC721 {

    uint public totalSupply;
    string public baseURI;

    modifier notContract() {
        require(!_isContract(msg.sender), "contract not allowed");
        require(msg.sender == tx.origin, "proxy contract not allowed");
        _;
    }

    constructor()
        ERC721("Hangout Xmas Card", "HangoutXmasCard")
    {
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        baseURI = baseURI_;
    }

    function mint() external notContract {
        _mint(msg.sender, totalSupply);
        totalSupply += 1;
    }

    // --------------------- internal function ---------------------
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function _isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
}
