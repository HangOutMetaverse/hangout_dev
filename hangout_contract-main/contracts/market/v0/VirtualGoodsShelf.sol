// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./GoodsShelfBase.sol";

contract VirtualGoodsShelf is GoodsShelfBase {

    constructor(string memory _name, address _caller)
        GoodsShelfBase(_name, address(0), _caller)
    {
    }

    function goodsType() external view override returns(GoodsType){
        return GoodsType.VIRTUAL;
    }

    function stockVirtual(uint quantity) external override {
        return;
    }

    function exchangedVirtual(uint quantity, address to) external override onlyCaller returns(bool) {
        return true;
    }
}