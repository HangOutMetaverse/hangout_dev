// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./GoodsShelfBase.sol";

contract ERC20GoodsShelf is GoodsShelfBase {

    using SafeERC20 for IERC20;

    event StockGoods(address goods, uint amount);
    event WithdrawGoods(address goods, uint amount, address to);

    constructor(string memory _name, address _goods, address _caller)
        GoodsShelfBase(_name, _goods, _caller)
    {
    }

    function goodsType() external view override returns(GoodsType){
        return GoodsType.ERC20;
    }

    function stockERC20(uint amount) external override nonReentrant {
        uint beforeBalance = IERC20(goods_).balanceOf(address(this));
        IERC20(goods_).safeTransferFrom(msg.sender, address(this), amount);
        uint afterBalance = IERC20(goods_).balanceOf(address(this));
        require(afterBalance >= beforeBalance && afterBalance - beforeBalance == amount, "transfer goods fail");
        emit StockGoods(goods_, amount);
    }

    function exchangedERC20(uint amount, address to) external override nonReentrant onlyCaller returns(bool) {
        IERC20(goods_).safeTransfer(to, amount);
        return true;
    }

    function withdrawGoods(address to) external virtual override onlyOwner {
        uint balance = IERC20(goods_).balanceOf(address(this));
        IERC20(goods_).safeTransfer(to, balance);
        emit WithdrawGoods(goods_, balance, to);
    }
}