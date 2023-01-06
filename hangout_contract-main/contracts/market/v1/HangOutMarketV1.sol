// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";


contract HangOutMarketV1 is ReentrancyGuard, Ownable, EIP712 {

    using Address for address;
    using SafeERC20 for IERC20;

    bytes32 constant public CALL_HASH_TYPE = keccak256(bytes("exchange(address user,uint256 goodsId,uint256 goodsQuantity,address money,uint256 moneyAmount,address callTarget,bytes callData,bytes comment)"));

    string public constant name = "HangOut Market V1";
    bool public start = false;
    address public signer;

    mapping(uint => uint) public inventoryQuantity;

    event Start(bool start);
    event Signer(address signer);
    event InventoryQuantity(uint goodsId, uint quantity);
    event Exchange(address user, uint goodsId, uint quantity, address money, uint moneyAmount, bytes comment);

    constructor()
        EIP712("HangOut Market V1", "1")
    {
    }

    function setStart(bool start_) external onlyOwner {
        start = start_;
        emit Start(start_);
    }

    function setSigner(address signer_) external onlyOwner {
        signer = signer_;
        emit Signer(signer);
    }

    function setInventoryQuantity(uint goodsId, uint quantity) external onlyOwner {
        inventoryQuantity[goodsId] = quantity;
        emit InventoryQuantity(goodsId, quantity);
    }

    function exchange(
        uint goodsId,
        uint goodsQuantity,
        address money,
        uint moneyAmount,
        address callTarget,
        bytes memory callData,
        bytes memory comment,
        bytes memory signature
    ) external nonReentrant {
        require(start, "have not start yet");
        require(inventoryQuantity[goodsId] >= goodsQuantity, "not enough inventory");

        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
                CALL_HASH_TYPE,
                msg.sender,
                goodsId,
                goodsQuantity,
                money,
                moneyAmount,
                callTarget,
                keccak256(callData),
                keccak256(comment)
            )));

        require(SignatureChecker.isValidSignatureNow(signer, digest, signature), "invalid signature");

        inventoryQuantity[goodsId] -= goodsQuantity;

        if (money != address(0) && moneyAmount > 0) {
            uint beforeBalance = IERC20(money).balanceOf(address(this));
            IERC20(money).safeTransferFrom(msg.sender, address(this), moneyAmount);
            uint afterBalance = IERC20(money).balanceOf(address(this));
            require(afterBalance >= beforeBalance && afterBalance - beforeBalance == moneyAmount, "transfer money fail");
        }

        if (callTarget != address(0) && callData.length != 0) {
            callTarget.functionCall(callData, "target call fail");
        }

        emit Exchange(msg.sender, goodsId, goodsQuantity, money, moneyAmount, comment);
    }
}