/*
 * SPDX-License-Identifier: MIT
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

contract HOPOPool is Ownable, EIP712 {

    bytes32 constant public CLAIM_CALL_HASH_TYPE = keccak256(bytes("Claim(address claimer,uint256 userNonce,uint256 amount)"));

    address public HOPO;
    address public signer;
    mapping(address => uint) public nextNonce;

    event Claim(address user, uint amount, uint nonce);

    constructor(address HOPO_)
        EIP712("HangOut Point", "1")
    {
        HOPO = HOPO_;
    }

    function setSigner(address signer_) external onlyOwner {
        signer = signer_;
    }

    function claim(uint userNonce, uint amount, bytes memory signature) external {
        require(nextNonce[msg.sender] == userNonce, "invalid user nonce");
        require(_verifyAuthSignature(msg.sender, userNonce, amount, signature), "invalid signature");
        nextNonce[msg.sender] = userNonce + 1;
        IERC20(HOPO).transfer(msg.sender, amount);
        emit Claim(msg.sender, amount, userNonce);
    }

    // --------------------- internal function ---------------------

    function _verifyAuthSignature(address claimer, uint userNonce, uint amount, bytes memory signature) internal view returns(bool) {
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
                CLAIM_CALL_HASH_TYPE,
                claimer,
                userNonce,
                amount
            )));

        return SignatureChecker.isValidSignatureNow(signer, digest, signature);
    }

}