// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IRawMaterialsBox is IERC165 {
    function mint(address to, uint id, uint amount) external;
}