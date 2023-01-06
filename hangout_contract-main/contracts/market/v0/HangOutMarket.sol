// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IGoodsShelf.sol";

struct GoodsShelvesInfo {
    address addr;
    string name;
    bool status;
}

struct MoneyInfo {
    address addr;
    string name;
}

interface IMoney {
    function name() external view returns(string memory);
}

contract HangOutMarket is ReentrancyGuard, Ownable {

    using EnumerableMap for EnumerableMap.AddressToUintMap;
    using SafeMath for uint;
    using SafeERC20 for IERC20;

    uint public constant priceFactor = 1e18;
    string public constant name = "HangOut Market (I)";
    bool public start = false;

    EnumerableMap.AddressToUintMap private goodsShelves;
    EnumerableMap.AddressToUintMap private moneys;
    mapping(address => mapping(address => uint)) public prices;

    event Start(bool start);
    event Money(address money, bool valid);
    event GoodsShelf(address goodsShelf, bool putOn);
    event Price(address goodsShelf, address[] moneys, uint[] prices);
    event ExchangedVirtual(address goodsShelf, address money, uint price, uint quantity, address to);
    event ExchangedERC20(address goodsShelf, address money, uint price, uint amount, address to);
    event ExchangedERC721(address goodsShelf, uint[] ids, address money, uint price, address to);
    event ExchangedERC1155(address goodsShelf, uint id, address money, uint price, uint quantity, address to);

    constructor() {
    }

    function setStart(bool start_) external onlyOwner {
        start = start_;
        emit Start(start_);
    }

    function setValidMoney(address money, bool valid) external onlyOwner {
        uint status = valid ? 1 : 0;
        moneys.set(money, status);
        emit Money(money, valid);
    }

    function putOnGoods(address goodsShelf_, address[] calldata moneys_, uint[] calldata prices_) external onlyOwner {
        require(goodsShelf_ != address(0), "goods shelf address is zero");
        require(IERC165(goodsShelf_).supportsInterface(type(IGoodsShelf).interfaceId), "invalid IGoodsShelf contract");
        require(moneys_.length == prices_.length, "moneys dont match prices");
        goodsShelves.set(goodsShelf_, 1);
        _updatePrice(goodsShelf_, moneys_, prices_);

        emit GoodsShelf(goodsShelf_, true);
        emit Price(goodsShelf_, moneys_, prices_);
    }

    function putOffGoods(address goodsShelf_) external onlyOwner {
        require(goodsShelf_ != address(0), "goods shelf address is zero");
        address money;
        for (uint i = 0; i < moneys.length(); i++) {
            (money,) = moneys.at(i);
            prices[goodsShelf_][money] = 0;
        }

        goodsShelves.set(goodsShelf_, 0);
        emit GoodsShelf(goodsShelf_, true);
    }

    function exchangeVirtual(address goodsShelf_, address money_, uint quantity_, address to_) external nonReentrant {
        require(start, "have not start yet");
        require(goodsShelf_ != address(0), "goods shelf address is zero");
        require(money_ != address(0), "money address is zero");
        require(moneys.get(money_) != 0, "invalid money");
        require(quantity_ != 0, "quantity is zero");
        require(to_ != address(0), "to is zero");
        require(goodsShelves.get(goodsShelf_) != 0, "goods shelf have not put on");
        require(IGoodsShelf(goodsShelf_).goodsType() == GoodsType.VIRTUAL, "invalid goods shelf type");

        uint price = prices[goodsShelf_][money_];
        require(price != 0, "price is zero");

        (bool suc, uint totalAmount) = quantity_.tryMul(price);
        require(suc, "invalid quantity*price");
        totalAmount = totalAmount.div(priceFactor);

        uint beforeBalance = IERC20(money_).balanceOf(goodsShelf_);
        IERC20(money_).safeTransferFrom(msg.sender, goodsShelf_, totalAmount);
        uint afterBalance = IERC20(money_).balanceOf(goodsShelf_);
        require(afterBalance >= beforeBalance && afterBalance - beforeBalance == totalAmount, "transfer money fail");

        suc = IGoodsShelf(goodsShelf_).exchangedVirtual(quantity_, to_);
        require(suc, "exchange fail");

        emit ExchangedVirtual(goodsShelf_, money_, price, quantity_, to_);
    }

    function exchangeERC20(address goodsShelf_, address money_, uint amount_, address to_) external nonReentrant {
        require(goodsShelf_ != address(0), "goods shelf address is zero");
        require(money_ != address(0), "money address is zero");
        require(moneys.get(money_) != 0, "invalid money");
        require(amount_ != 0, "amount is zero");
        require(to_ != address(0), "to is zero");
        require(goodsShelves.get(goodsShelf_) != 0, "goods shelf have not put on");
        require(IGoodsShelf(goodsShelf_).goodsType() == GoodsType.ERC20, "invalid goods shelf type");

        uint price = prices[goodsShelf_][money_];
        require(price != 0, "price is zero");

        (bool suc, uint totalAmount) = amount_.tryMul(price);
        require(suc, "invalid amount*price");
        totalAmount = totalAmount.div(priceFactor);

        uint beforeBalance = IERC20(money_).balanceOf(goodsShelf_);
        IERC20(money_).safeTransferFrom(msg.sender, goodsShelf_, totalAmount);
        uint afterBalance = IERC20(money_).balanceOf(goodsShelf_);
        require(afterBalance >= beforeBalance && afterBalance - beforeBalance == totalAmount, "transfer money fail");

        suc = IGoodsShelf(goodsShelf_).exchangedERC20(amount_, to_);
        require(suc, "exchange fail");

        emit ExchangedERC20(goodsShelf_, money_, price, amount_, to_);
    }

    function exchangeERC721(address goodsShelf_, address money_, uint[] calldata ids_, address to_) external nonReentrant {
        require(goodsShelf_ != address(0), "goods shelf address is zero");
        require(money_ != address(0), "money address is zero");
        require(moneys.get(money_) != 0, "invalid money");
        require(ids_.length != 0, "ERC721 id array length is zero");
        require(to_ != address(0), "to is zero");
        require(goodsShelves.get(goodsShelf_) != 0, "goods shelf have not put on");
        require(IGoodsShelf(goodsShelf_).goodsType() == GoodsType.ERC721, "invalid goods shelf type");

        uint price = prices[goodsShelf_][money_];
        require(price != 0, "price is zero");

        (bool suc, uint totalAmount) = ids_.length.tryMul(price);
        require(suc, "invalid amount*price");
        totalAmount = totalAmount.div(priceFactor);

        uint beforeBalance = IERC20(money_).balanceOf(goodsShelf_);
        IERC20(money_).safeTransferFrom(msg.sender, goodsShelf_, totalAmount);
        uint afterBalance = IERC20(money_).balanceOf(goodsShelf_);
        require(afterBalance >= beforeBalance && afterBalance - beforeBalance == totalAmount, "transfer money fail");

        suc = IGoodsShelf(goodsShelf_).exchangedERC721(ids_, to_);
        require(suc, "exchange fail");

        emit ExchangedERC721(goodsShelf_, ids_, money_, price, to_);
    }

    function exchangeERC1155(address goodsShelf_, uint id_, address money_, uint quantity_, address to_) external nonReentrant {
        require(goodsShelf_ != address(0), "goods shelf address is zero");
        require(money_ != address(0), "money address is zero");
        require(moneys.get(money_) != 0, "invalid money");
        require(quantity_ != 0, "quantity is zero");
        require(to_ != address(0), "to is zero");
        require(goodsShelves.get(goodsShelf_) != 0, "goods shelf have not put on");
        require(IGoodsShelf(goodsShelf_).goodsType() == GoodsType.ERC1155, "invalid goods shelf type");

        uint price = prices[goodsShelf_][money_];
        require(price != 0, "price is zero");

        (bool suc, uint totalAmount) = quantity_.tryMul(price);
        require(suc, "invalid amount*price");
        totalAmount = totalAmount.div(priceFactor);

        uint beforeBalance = IERC20(money_).balanceOf(goodsShelf_);
        IERC20(money_).safeTransferFrom(msg.sender, goodsShelf_, totalAmount);
        uint afterBalance = IERC20(money_).balanceOf(goodsShelf_);
        require(afterBalance >= beforeBalance && afterBalance - beforeBalance == totalAmount, "transfer money fail");

        suc = IGoodsShelf(goodsShelf_).exchangedERC1155(id_, quantity_, to_);
        require(suc, "exchange fail");

        emit ExchangedERC1155(goodsShelf_, id_, money_, price, quantity_, to_);
    }

    function setPrice(address goodsShelf_, address[] calldata moneys_, uint[] calldata prices_) external onlyOwner {
        _updatePrice(goodsShelf_, moneys_, prices_);
    }

    function getGoodsShelvesInfos() external view returns(GoodsShelvesInfo[] memory) {
        address goodsShelf;
        uint status;
        GoodsShelvesInfo[] memory infos = new GoodsShelvesInfo[](goodsShelves.length());
        for (uint i = 0; i < goodsShelves.length(); i++) {
            (goodsShelf, status) = goodsShelves.at(i);
            infos[i].addr = goodsShelf;
            infos[i].name = IGoodsShelf(goodsShelf).name();
            infos[i].status = status > 0;
        }

        return infos;
    }

    function getMoneyInfos() external view returns(MoneyInfo[] memory) {
        MoneyInfo[] memory infos = new MoneyInfo[](moneys.length());
        for (uint i = 0; i < moneys.length(); i++) {
            (infos[i].addr,) = moneys.at(i);
            infos[i].name = IMoney(infos[i].addr).name();
        }

        return infos;
    }


    // --------------- internal function ---------------
    function _updatePrice(address goodsShelf_, address[] calldata moneys_, uint[] calldata prices_) internal {
        uint status;
        for (uint i = 0; i < moneys_.length; i++) {
            require(moneys_[i] != address(0), "money address is zero");
            require(prices_[i] != 0, "price is zero");
            require(moneys.get(moneys_[i]) > 0, "invalid money");
            IMoney(moneys_[i]).name();
            prices[goodsShelf_][moneys_[i]] = prices_[i];
        }
    }
}