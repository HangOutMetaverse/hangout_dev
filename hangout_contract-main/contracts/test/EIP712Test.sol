// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract EIP712Test is EIP712 {

    string constant public MINT_CALL_HASH_TYPE = "mintLands(uint256[] memory landIDs, bytes memory signature)";
    string constant public DOMAIN_SEPARATOR_HASH_TYPE = "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)";

    constructor() EIP712("HangOutLand", "1") {

    }

    function getChainId() public view returns(uint256) {
        return block.chainid;
    }

    function getDomainSeparatorV4() public view returns(bytes32) {
        return _domainSeparatorV4();
    }

    function getDomainSeparatorV4BaseData() public view returns(bytes32,bytes32,bytes32,uint256) {
        bytes32 typeHash = keccak256(bytes(DOMAIN_SEPARATOR_HASH_TYPE));
        bytes32 hashedName = keccak256(bytes("HangOutLand"));
        bytes32 hashedVersion = keccak256(bytes("1"));

        return (typeHash, hashedName, hashedVersion, block.chainid);
    }

    function getMintCallHash(address minter, uint256[] calldata ids) public pure returns(bytes memory) {
        return abi.encode(keccak256(bytes(MINT_CALL_HASH_TYPE)), minter, ids);
    }

    function getTypedData(address minter, uint256[] calldata ids) external view returns(bytes memory) {
        return abi.encodePacked("\x19\x01", _domainSeparatorV4(), keccak256(abi.encode(MINT_CALL_HASH_TYPE, minter, ids)));
    }

//    function getTypedDataHash(address minter, uint256[] calldata ids) public view returns(bytes32) {
//        bytes32 typedDataHash = ECDSA.toTypedDataHash(_domainSeparatorV4(), keccak256(abi.encode(MINT_CALL_HASH_TYPE, minter, ids)));
//        bytes32 digest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", typedDataHash));
//        return digest;
//    }

    function getTypedDataHash(address minter, uint256[] calldata landIds) public view returns(bytes32) {
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
                keccak256(bytes(MINT_CALL_HASH_TYPE)),
                minter,
                landIds
            )));

        return digest;
    }

//    function getEIP712Signer(address minter, uint256[] calldata ids, bytes32 r, bytes32 s, uint8 v) public view returns(address) {
//        bytes32 digest = keccak256(abi.encodePacked(EC_SIGN_PRE,
//            ECDSA.toTypedDataHash(_domainSeparatorV4(),
//            keccak256(abi.encode(MINT_CALL_HASH_TYPE, minter, ids))
//            )));
//        return ecrecover(digest, v, r, s);
//    }

    function bytesParam(bytes memory param) public pure returns(bytes memory) {
        return param;
    }

    function getEIP712Signer(address minter, uint256[] calldata landIds, bytes memory signature) public view returns(address) {
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
                keccak256(bytes(MINT_CALL_HASH_TYPE)),
                minter,
                landIds
            )));

        return ECDSA.recover(digest, signature);
    }

}
