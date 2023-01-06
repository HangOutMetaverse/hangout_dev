// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

enum GoodsType { VIRTUAL, ERC20, ERC721, ERC1155 }

interface IGoodsShelf is IERC165 {
    function name() external view returns(string memory);
    function goodsType() external view returns(GoodsType);
    function goods() external view returns(address);
    function caller() external view returns(address);

    function stockVirtual(uint quantity) external;
    function stockERC20(uint amount) external;
    function stockERC721(uint[] memory ids) external;
    function stockERC1155(uint id, uint quantity) external;

    function exchangedVirtual(uint quantity, address to) external returns(bool);
    function exchangedERC20(uint amount, address to) external returns(bool);
    function exchangedERC721(uint[] memory ids, address to) external returns(bool);
    function exchangedERC1155(uint id, uint quantity, address to) external returns(bool);

    function withdrawMoney(address money, uint amount, address to) external;
    function withdrawGoods(address to) external;
}