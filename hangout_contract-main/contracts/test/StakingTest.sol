/*
 * SPDX-License-Identifier: MIT
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingTest {

    address public asset;
    mapping(address => uint) quantities;

    constructor(address asset_)
    {
        asset = asset_;
    }

    function stake(uint quantity) external {
        IERC20(asset).transferFrom(msg.sender, address(this), quantity);
        quantities[msg.sender] += quantity;
    }

    function unstake(uint quantity) external {
        require(quantities[msg.sender] >= quantity, "not enough staking");
        quantities[msg.sender] -= quantity;
        IERC20(asset).transfer(msg.sender, quantity);
    }

}