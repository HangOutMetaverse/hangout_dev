// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EIP20Test is IERC20 {

    function totalSupply() external override view returns (uint256) {
        return 0;
    }

    function balanceOf(address account) external override view returns (uint256) {
        return 0;
    }

    function transfer(address to, uint256 amount) external override returns (bool) {
        return true;
    }

    function allowance(address owner, address spender) external override view returns (uint256) {
        return 0;
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external override returns (bool) {
        return true;
    }

}
