// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "./GoodsShelfBase.sol";

contract ERC1155GoodsShelf is IERC1155Receiver, GoodsShelfBase {

    using EnumerableMap for EnumerableMap.UintToUintMap;

    EnumerableMap.UintToUintMap private erc1155Ids_;

    event StockGoods(address goods, uint id, uint amount);
    event WithdrawGoods(address goods, uint[] ids, uint[] amounts, address to);

    constructor(string memory _name, address _goods, address _caller)
        GoodsShelfBase(_name, _goods, _caller)
    {
    }

    function goodsType() external view override returns(GoodsType){
        return GoodsType.ERC1155;
    }

    function stockERC1155(uint id, uint quantity) external override nonReentrant {
        uint beforeBalance = IERC1155(goods_).balanceOf(address(this), id);
        IERC1155(goods_).safeTransferFrom(msg.sender, address(this), id, quantity, "");
        uint afterBalance = IERC1155(goods_).balanceOf(address(this), id);
        require(afterBalance >= beforeBalance && afterBalance - beforeBalance == quantity, "transfer goods fail");
        erc1155Ids_.set(id, 1);
        emit StockGoods(goods_, id, quantity);
    }

    function exchangedERC1155(uint id, uint quantity, address to) external override nonReentrant onlyCaller returns(bool) {
        IERC1155(goods_).safeTransferFrom(address(this), to, id, quantity, "");
        return true;
    }

    function withdrawGoods(address to) external virtual override onlyOwner {
        uint length = erc1155Ids_.length();
        address[] memory accs = new address[](length);
        uint[] memory ids = new uint[](length);
        for (uint i = 0; i < length; i++) {
            accs[i] = address(this);
            (ids[i],) = erc1155Ids_.at(i);
        }

        uint[] memory amounts = IERC1155(goods_).balanceOfBatch(accs, ids);
        IERC1155(goods_).safeBatchTransferFrom(address(this), to, ids, amounts, "");
        emit WithdrawGoods(goods_, ids, amounts, to);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(GoodsShelfBase, IERC165) returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}