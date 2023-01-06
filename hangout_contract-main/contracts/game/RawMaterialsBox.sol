// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IRawMaterialsBox.sol";

contract RawMaterialsBox is ERC1155Supply, IRawMaterialsBox, Ownable {
    string public name;
    string public symbol;
    mapping(address => bool) public minters;

    modifier onlyMinter() {
        require(minters[msg.sender], "caller is not minter");
        _;
    }

    event Minter(address minter, bool open);

    constructor(
        string memory uri_,
        string memory name_,
        string memory symbol_
    )
        ERC1155(uri_)
    {
        name = name_;
        symbol = symbol_;
    }

    function setURI(
        string memory uri_
    ) external onlyOwner {
        _setURI(uri_);
    }

    function setMinter(
        address minter,
        bool open
    ) external onlyOwner {
        minters[minter] = open;
        emit Minter(minter, open);
    }

    function mint(
        address to,
        uint id,
        uint amount
    ) external override onlyMinter {
        _mint(to, id, amount, '');
    }

    function burn(
        address account,
        uint256 id,
        uint256 value
    ) public virtual {
        require(
            account == _msgSender() || isApprovedForAll(account, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );

        _burn(account, id, value);
    }

    function burnBatch(
        address account,
        uint256[] memory ids,
        uint256[] memory values
    ) public virtual {
        require(
            account == _msgSender() || isApprovedForAll(account, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );

        _burnBatch(account, ids, values);
    }

    function uri(
        uint256 id
    )
    public
    view
    override
    returns (string memory)
    {
        require(exists(id), "URI: nonexistent token");
        return string(abi.encodePacked(super.uri(id), Strings.toString(id)));
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, IERC165) returns (bool) {
        return
        interfaceId == type(IRawMaterialsBox).interfaceId ||
        super.supportsInterface(interfaceId);
    }

}