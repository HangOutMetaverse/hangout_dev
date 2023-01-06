// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IGoodsShelf.sol";

abstract contract GoodsShelfBase is IGoodsShelf, ERC165, Ownable, ReentrancyGuard {

    using SafeERC20 for IERC20;

    string internal name_;
    address internal goods_;
    address internal caller_;

    modifier onlyCaller() {
        require(msg.sender == caller_, "only caller");
        _;
    }

    event Caller(address caller);
    event WithdrawMoney(address goods, address money, uint amount, address to);

    constructor(string memory _name, address _goods, address _caller) {
        name_ = _name;
        goods_ = _goods;
        caller_ = _caller;
    }

    function setCaller(address _caller) external onlyOwner {
        caller_ = _caller;
        emit Caller(_caller);
    }

    function name() external override view returns(string memory) {
        return name_;
    }

    function goods() external override view returns(address) {
        return goods_;
    }

    function caller() external override view returns(address) {
        return caller_;
    }

    function stockVirtual(uint quantity) external virtual override {
        revert("invalid goods type");
    }

    function stockERC20(uint amount) external virtual override {
        revert("invalid goods type");
    }

    function stockERC721(uint[] memory ids) external virtual override {
        revert("invalid goods type");
    }

    function stockERC1155(uint id, uint quantity) external virtual override {
        revert("invalid goods type");
    }

    function exchangedVirtual(uint quantity, address to) external virtual override returns(bool) {
        revert("invalid goods type");
    }

    function exchangedERC20(uint amount, address to) external virtual override returns(bool) {
        revert("invalid goods type");
    }

    function exchangedERC721(uint[] memory ids, address to) external virtual override returns(bool) {
        revert("invalid goods type");
    }

    function exchangedERC1155(uint id, uint quantity, address to) external virtual override returns(bool) {
        revert("invalid goods type");
    }

    function withdrawMoney(address money, uint amount, address to) external virtual override onlyOwner {
        IERC20(money).safeTransfer(to, amount);
        emit WithdrawMoney(goods_, money, amount, to);
    }

    function withdrawGoods(address to) external virtual override {
        return;
    }

    // -------------------- IERC165 --------------------
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return
        interfaceId == type(IGoodsShelf).interfaceId ||
        super.supportsInterface(interfaceId);
    }
}