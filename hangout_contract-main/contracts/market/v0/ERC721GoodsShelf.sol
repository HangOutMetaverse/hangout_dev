// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./GoodsShelfBase.sol";

contract ERC721GoodsShelf is GoodsShelfBase {

    using SafeERC20 for IERC20;

    event StockGoods(address goods, uint[] ids);
    event WithdrawGoods(address goods, uint[] ids, address to);

    constructor(string memory _name, address _goods, address _caller)
        GoodsShelfBase(_name, _goods, _caller)
    {
    }

    function goodsType() external view override returns(GoodsType){
        return GoodsType.ERC721;
    }

    function stockERC721(uint[] memory ids) external virtual override nonReentrant {
        for (uint i = 0; i < ids.length; i++) {
            IERC721(goods_).transferFrom(msg.sender, address(this), ids[i]);
            require(IERC721(goods_).ownerOf(ids[i]) == address(this), "transfer ERC721 fail");
        }

        emit StockGoods(goods_, ids);
    }

    function exchangedERC721(uint[] memory ids, address to) external virtual override nonReentrant onlyCaller returns(bool) {
        for (uint i = 0; i < ids.length; i++) {
            IERC721(goods_).transferFrom(address(this), to, ids[i]);
        }

        return true;
    }

    function withdrawGoods(address to) external virtual override onlyOwner {
        revert("invalid call");
    }

    function withdrawERC721(uint[] memory ids, address to) external onlyOwner {
        for (uint i = 0; i < ids.length; i++) {
            IERC721(goods_).transferFrom(address(this), to, ids[i]);
        }
        emit WithdrawGoods(goods_, ids, to);
    }
}