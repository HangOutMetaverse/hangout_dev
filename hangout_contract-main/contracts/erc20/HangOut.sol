/*
 * SPDX-License-Identifier: MIT
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HangOut is ERC20 {

    constructor()
        ERC20("HangOut", "HO")
    {
        _mint(msg.sender, 1e10 ether);
    }

}