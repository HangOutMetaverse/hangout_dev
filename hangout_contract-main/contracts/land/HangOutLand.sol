/*
 * SPDX-License-Identifier: MIT
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title HangOutLand contract
 * @dev Extends ERC721 Non-Fungible Token Standard basic implementation
 */
contract HangOutLand is ERC721, EIP712, Ownable {

    using Strings for uint256;

    string constant public WHITELIST_MINT_FIELD_CALL_HASH_TYPE = "mintFieldWhitelist(uint256 fieldId, bytes memory signature, bytes32[] calldata proof)";
    string constant public WHITELIST_MINT_LANDS_CALL_HASH_TYPE = "mintLandsWhitelist(uint256[] memory landIDs, bytes memory signature, bytes32[] calldata proof)";
    string constant public MINT_FIELD_CALL_HASH_TYPE = "mintField(uint256 fieldId, bytes memory signature)";
    string constant public MINT_LANDS_CALL_HASH_TYPE = "mintLands(uint256[] memory landIDs, bytes memory signature)";

    uint256 constant public LARGE_PRICE = .5 ether;
    uint256 constant public MEDIUM_PRICE = .3 ether;
    uint256 constant public SMALL_PRICE = .26 ether;

    uint256 constant maxLandsWhileWhitelistField = 12;
    uint256 constant maxLandsWhileWhitelistLands = 5;
    uint256 constant maxMintsPerTx = 3;

    // land models
    enum Model{ LARGE, MEDIUM, SMALL }

    // 1 field = 2 large + 4 medium + 6 small
    uint256 constant LARGE_PER_FIELD = 2;
    uint256 constant MEDIUM_PER_FIELD = 4;
    uint256 constant SMALL_PER_FIELD = 6;
    uint256 constant FIELD_LAND_NUMBER = LARGE_PER_FIELD + MEDIUM_PER_FIELD + SMALL_PER_FIELD;

    Model[FIELD_LAND_NUMBER] ModelsInField = [
        Model.LARGE, Model.LARGE,
        Model.MEDIUM, Model.MEDIUM, Model.MEDIUM, Model.MEDIUM,
        Model.SMALL, Model.SMALL, Model.SMALL, Model.SMALL, Model.SMALL, Model.SMALL
    ];

    uint256 public constant totalMaxSupply = 326*FIELD_LAND_NUMBER;
    uint256[3] public modelMintCount = [0, 0, 0];

    // Base URI
    string public baseURI;

    // Accountant, who has the authority to withdraw money
    address public accountant;

    // Signature signer
    address public signer;

    // Mint field whitelist merkle root
    bytes32 public fieldMerkleRoot;

    // mint lands whitelist merkle root
    bytes32 public landsMerkleRoot;

    // Minting switch
    bool public openMint = false;

    // Whitelist minted field count
    mapping(address => uint256) public mintCountWhileField;

    // Whitelist minted land count
    mapping(address => uint256) public mintCountWhileLand;

    // events
    event OnWithdraw(address to, uint256 amount);

    modifier onlyAccountant() {
        require(accountant != address(0), "accountant is 0");
        require(accountant == _msgSender(), "caller is not the accountant");
        _;
    }

    modifier onlyNotContract() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    constructor(address signer_, address accountant_, bytes32 filedMerkleRoot_, bytes32 landsMerkleRoot_)
        ERC721("HangOutLand", "HOLAND")
        EIP712("HangOutLand", "1")
    {
        signer = signer_;
        fieldMerkleRoot = filedMerkleRoot_;
        landsMerkleRoot = landsMerkleRoot_;
        accountant = accountant_;
    }

    function setSigner(address signer_) external onlyOwner {
        signer = signer_;
    }

    function setFieldMerkleRoot(bytes32 merkleRoot_) external onlyOwner {
        fieldMerkleRoot = merkleRoot_;
    }

    function setLandsMerkleRoot(bytes32 merkleRoot_) external onlyOwner {
        landsMerkleRoot = merkleRoot_;
    }

    function setAccountant(address accountant_) external onlyOwner {
        accountant = accountant_;
    }

    /**
     * @dev Withdraw ETH
     */
    function withdraw(address payable to, uint256 amount) external onlyAccountant {
        to.transfer(amount);
        emit OnWithdraw(to, amount);
    }


    /**
     * @dev Set base URI
     */
    function setBaseURI(string memory baseURI_) external onlyOwner {
        baseURI = baseURI_;
    }

    /**
     * @dev Flip mint state
     */
    function flipMintState() public onlyOwner {
        openMint = !openMint;
    }

    /**
     * @dev Whitelist mint field
     */
    function mintFieldWhitelist(uint256 fieldId, bytes memory signature, bytes32[] calldata proof) external payable onlyNotContract {
        require(openMint, "mint not open");
        require(verifyFieldMerkle(_accountToLeaf(msg.sender), proof), "invalid whitelist proof");
        require(fieldId < totalMaxSupply/FIELD_LAND_NUMBER, "field id overrange");
        require(mintCountWhileField[msg.sender] + FIELD_LAND_NUMBER <= maxLandsWhileWhitelistField, "mint too many by one address");
        require(msg.value >= LARGE_PRICE*LARGE_PER_FIELD+MEDIUM_PRICE*MEDIUM_PER_FIELD+SMALL_PRICE*SMALL_PER_FIELD, "not enough ether sent");

        uint256[] memory landIDs = new uint256[](FIELD_LAND_NUMBER);
        uint256 beginLandId = fieldId*FIELD_LAND_NUMBER;
        for (uint256 i = 0; i < FIELD_LAND_NUMBER; i++) {
            landIDs[i] = beginLandId + i;
        }
        require(_verifyMintSignature(msg.sender, landIDs, WHITELIST_MINT_FIELD_CALL_HASH_TYPE, signature), "invalid minting signature");

        modelMintCount[0] += LARGE_PER_FIELD;
        modelMintCount[1] += MEDIUM_PER_FIELD;
        modelMintCount[2] += SMALL_PER_FIELD;
        mintCountWhileField[msg.sender] += FIELD_LAND_NUMBER;

        for (uint256 i = 0; i < FIELD_LAND_NUMBER; i++) {
            _safeMint(msg.sender, landIDs[i]);
        }
    }

    /**
     * @dev Whitelist mint lands
     */
    function mintLandsWhitelist(uint256[] memory landIDs, bytes memory signature, bytes32[] calldata proof) external payable onlyNotContract {
        require(openMint, "mint not open");
        require(verifyLandsMerkle(_accountToLeaf(msg.sender), proof), "invalid whitelist proof");
        require(_verifyMintSignature(msg.sender, landIDs, WHITELIST_MINT_LANDS_CALL_HASH_TYPE, signature), "invalid minting signature");
        require(landIDs.length <= maxMintsPerTx, "mint too many at a time");
        require(mintCountWhileLand[msg.sender] + landIDs.length <= maxLandsWhileWhitelistLands, "mint too many by one address");

        uint256[3] memory incNumbers;
        for (uint256 i = 0; i < landIDs.length; i++) {
            require(landIDs[i] < totalMaxSupply, "land id overrange");
            Model m = ModelsInField[landIDs[i]%FIELD_LAND_NUMBER];
            incNumbers[uint256(m)] += 1;
        }

        modelMintCount[0] += incNumbers[0];
        modelMintCount[1] += incNumbers[1];
        modelMintCount[2] += incNumbers[2];

        mintCountWhileLand[msg.sender] += landIDs.length;

        require(msg.value >= LARGE_PRICE*incNumbers[0]+MEDIUM_PRICE*incNumbers[1]+SMALL_PRICE*incNumbers[2], "not enough ether sent");

        for (uint256 i = 0; i < landIDs.length; i++) {
            _safeMint(msg.sender, landIDs[i]);
        }
    }

    /**
     * @dev Mint field
     */
    function mintField(uint256 fieldId, bytes memory signature) external payable onlyNotContract {
        require(openMint, "mint not open");
        require(fieldId < totalMaxSupply/FIELD_LAND_NUMBER, "field id overrange");
        require(msg.value >= LARGE_PRICE*LARGE_PER_FIELD+MEDIUM_PRICE*MEDIUM_PER_FIELD+SMALL_PRICE*SMALL_PER_FIELD, "not enough ether sent");

        uint256[] memory landIDs = new uint256[](FIELD_LAND_NUMBER);
        uint256 beginLandId = fieldId*FIELD_LAND_NUMBER;
        for (uint256 i = 0; i < FIELD_LAND_NUMBER; i++) {
            landIDs[i] = beginLandId + i;
        }
        require(_verifyMintSignature(msg.sender, landIDs, MINT_FIELD_CALL_HASH_TYPE, signature), "invalid minting signature");

        modelMintCount[0] += LARGE_PER_FIELD;
        modelMintCount[1] += MEDIUM_PER_FIELD;
        modelMintCount[2] += SMALL_PER_FIELD;

        for (uint256 i = 0; i < FIELD_LAND_NUMBER; i++) {
            _safeMint(msg.sender, landIDs[i]);
        }
    }

    /**
     * @dev Mint lands
     */
    function mintLands(uint256[] memory landIDs, bytes memory signature) external payable onlyNotContract {
        require(openMint, "mint not open");
        require(_verifyMintSignature(msg.sender, landIDs, MINT_LANDS_CALL_HASH_TYPE, signature), "invalid minting signature");
        require(landIDs.length <= maxMintsPerTx, "mint too many at a time");

        uint256[3] memory incNumbers;
        for (uint256 i = 0; i < landIDs.length; i++) {
            require(landIDs[i] < totalMaxSupply, "land id overrange");
            Model m = ModelsInField[landIDs[i]%FIELD_LAND_NUMBER];
            incNumbers[uint256(m)] += 1;
        }

        modelMintCount[0] += incNumbers[0];
        modelMintCount[1] += incNumbers[1];
        modelMintCount[2] += incNumbers[2];

        require(msg.value >= LARGE_PRICE*incNumbers[0]+MEDIUM_PRICE*incNumbers[1]+SMALL_PRICE*incNumbers[2], "not enough ether sent");

        for (uint256 i = 0; i < landIDs.length; i++) {
            _safeMint(msg.sender, landIDs[i]);
        }
    }

    /**
     * @dev Get total supply
     */
    function totalSupply() public view returns (uint) {
        return modelMintCount[0] + modelMintCount[1] + modelMintCount[2];
    }

    /**
     * @dev Get land model
     */
    function landModel(uint256 id) public view returns(Model) {
        require(id < totalMaxSupply, "exceed max id");
        require(_exists(id), "token doesn't exist");
        return ModelsInField[id%FIELD_LAND_NUMBER];
    }

    /**
     * @dev Verify minting field merkle tree proof
     */
    function verifyFieldMerkle(bytes32 leaf, bytes32[] memory proof) public view returns (bool) {
        return MerkleProof.verify(proof, fieldMerkleRoot, leaf);
    }

    /**
     * @dev Verify minting lands merkle tree proof
     */
    function verifyLandsMerkle(bytes32 leaf, bytes32[] memory proof) public view returns (bool) {
        return MerkleProof.verify(proof, landsMerkleRoot, leaf);
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /**
     * @dev Verify EIP712 signature for minting
     */
    function _verifyMintSignature(address minter, uint256[] memory landIds, string memory callHashType, bytes memory signature) internal view returns(bool) {
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
                keccak256(bytes(callHashType)),
                minter,
                landIds
            )));

        return SignatureChecker.isValidSignatureNow(signer, digest, signature);
    }

    /**
     * @dev Convert account address to bytes32
     */
    function _accountToLeaf(address account) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(account)));
    }
}