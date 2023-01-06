// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IRawMaterialsBox.sol";

struct PsychedelicForestLevelBase {
    string description;
    uint probability;
    bool dropLoot;
    uint subLevelCount;
}

struct PsychedelicForestLevel {
    PsychedelicForestLevelBase base;
    mapping(uint => PsychedelicForestLevel) subLevels;
}

contract PsychedelicForest is ReentrancyGuard, Ownable {
    string public constant name = "Psychedelic Forest (I)";

    bool public start = false;

    mapping(address => uint) public adventurersTime;
    mapping(address => uint) public nextAdventureIds;
    mapping(address => mapping(uint => uint[])) public adventurersLog;
    uint public interval;
    PsychedelicForestLevel public levelRoot;
    uint constant public probabilityBase = 10000;

    IRawMaterialsBox public rawMaterialsBox;
    uint public rawMaterialsBoxId;

    event SetStart(bool start);
    event SetRootDescription(string description);
    event SetInterval(uint interval);
    event Adventure(address user, uint id, uint timestamp);
    event RawMaterialsBox(address rawMaterialsBox);

    constructor(string memory rootDescription_, uint interval_) {
        interval = interval_;
        levelRoot.base.description = rootDescription_;
        levelRoot.base.probability = probabilityBase;
        levelRoot.base.dropLoot = false;
    }

    function setStart(bool start_) external onlyOwner {
        start = start_;
        emit SetStart(start_);
    }

    function setRootDescription(string memory description) external onlyOwner {
        levelRoot.base.description = description;
        emit SetRootDescription(description);
    }

    function setInterval(uint interval_) external onlyOwner {
        interval = interval_;
        emit SetInterval(interval);
    }

    function setRawMaterialsBox(address rawMaterialsBox_, uint rawMaterialsBoxId_) external onlyOwner {
        require(IRawMaterialsBox(rawMaterialsBox_).supportsInterface(type(IRawMaterialsBox).interfaceId), "invalid RawMaterialsBox");
        rawMaterialsBox = IRawMaterialsBox(rawMaterialsBox_);
        rawMaterialsBoxId = rawMaterialsBoxId_;
        emit RawMaterialsBox(rawMaterialsBox_);
    }

    function setLevels(uint[] calldata levelPath, PsychedelicForestLevelBase[] calldata subLevels) external onlyOwner {
        require(!start, "need stop adventure first");
        PsychedelicForestLevel storage pointLevel = levelRoot;
        for (uint i = 0; i < levelPath.length; i++) {
            require(levelPath[i] < pointLevel.base.subLevelCount, "invalid level path");
            pointLevel = pointLevel.subLevels[levelPath[i]];
        }

        uint totalProbability = 0;
        pointLevel.base.subLevelCount = subLevels.length;
        for (uint i = 0; i < subLevels.length; i++) {
            PsychedelicForestLevel storage level = pointLevel.subLevels[i];
            level.base.description = subLevels[i].description;
            level.base.probability = subLevels[i].probability;
            level.base.dropLoot = subLevels[i].dropLoot;
            level.base.subLevelCount = 0;
            totalProbability += subLevels[i].probability;
        }

        require(totalProbability == probabilityBase, "invalid sub levels total probability");
    }

    function adventure() external nonReentrant {
        require(start, "have stopped");
        require(adventurersTime[msg.sender] <= block.timestamp, "waiting interval");
        require(address(rawMaterialsBox) != address(0), "invalid rawMaterialsBox");
        adventurersTime[msg.sender] = block.timestamp + interval;

        uint id = nextAdventureIds[msg.sender];
        nextAdventureIds[msg.sender] = id + 1;

        uint[] storage log = adventurersLog[msg.sender][id];

        uint random = getRandNum_(msg.sender);
        PsychedelicForestLevel storage pointLevel = levelRoot;

        while (true) {
            uint offset = random % probabilityBase + 1;
            for (uint i = 0; i < pointLevel.base.subLevelCount; i++) {
                if (offset <= pointLevel.subLevels[i].base.probability) {
                    pointLevel = pointLevel.subLevels[i];
                    log.push(i);
                    break;
                } else {
                    offset -= pointLevel.subLevels[i].base.probability;
                    random = getRandNumFromSeed_(random);
                }
            }

            if (pointLevel.base.subLevelCount == 0) {
                break;
            }
        }

        if (pointLevel.base.dropLoot) {
            rawMaterialsBox.mint(msg.sender, rawMaterialsBoxId, 1);
        }

        emit Adventure(msg.sender, id, block.timestamp);
    }

    // ------------------- view function -------------------
    function getSubLevels(uint[] calldata levelPath) external view returns(PsychedelicForestLevelBase[] memory) {
        PsychedelicForestLevel storage pointLevel = levelRoot;
        for (uint i = 0; i < levelPath.length; i++) {
            require(levelPath[i] < pointLevel.base.subLevelCount, "invalid level path");
            pointLevel = pointLevel.subLevels[levelPath[i]];
        }

        PsychedelicForestLevelBase[] memory subLevels = new PsychedelicForestLevelBase[](pointLevel.base.subLevelCount);
        for (uint i = 0; i < pointLevel.base.subLevelCount; i++) {
            subLevels[i].description = pointLevel.subLevels[i].base.description;
            subLevels[i].probability = pointLevel.subLevels[i].base.probability;
            subLevels[i].dropLoot = pointLevel.subLevels[i].base.dropLoot;
            subLevels[i].subLevelCount = pointLevel.subLevels[i].base.subLevelCount;
        }

        return subLevels;
    }

    function getLevelPathInfo(uint[] calldata levelPath) external view returns(PsychedelicForestLevelBase[] memory) {
        PsychedelicForestLevelBase[] memory levelPathInfo = new PsychedelicForestLevelBase[](levelPath.length);
        PsychedelicForestLevel storage pointLevel = levelRoot;
        for (uint i = 0; i < levelPath.length; i++) {
            require(levelPath[i] < pointLevel.base.subLevelCount, "invalid level path");
            pointLevel = pointLevel.subLevels[levelPath[i]];
            levelPathInfo[i].description = pointLevel.base.description;
            levelPathInfo[i].probability = pointLevel.base.probability;
            levelPathInfo[i].dropLoot = pointLevel.base.dropLoot;
            levelPathInfo[i].subLevelCount = pointLevel.base.subLevelCount;
        }

        return levelPathInfo;
    }

    function getLevelPathInfoFromId(address user, uint id) external view returns(PsychedelicForestLevelBase[] memory) {
        require(id < nextAdventureIds[user], "invalid adventure id");
        uint[] storage levelPath = adventurersLog[user][id];

        PsychedelicForestLevelBase[] memory levelPathInfo = new PsychedelicForestLevelBase[](levelPath.length);
        PsychedelicForestLevel storage pointLevel = levelRoot;
        for (uint i = 0; i < levelPath.length; i++) {
            require(levelPath[i] < pointLevel.base.subLevelCount, "invalid level path");
            pointLevel = pointLevel.subLevels[levelPath[i]];
            levelPathInfo[i].description = pointLevel.base.description;
            levelPathInfo[i].probability = pointLevel.base.probability;
            levelPathInfo[i].dropLoot = pointLevel.base.dropLoot;
            levelPathInfo[i].subLevelCount = pointLevel.base.subLevelCount;
        }

        return levelPathInfo;
    }

    function getAdventurerLog(address user, uint id) external view returns(uint[] memory) {
        uint[] storage path = adventurersLog[user][id];
        uint[] memory ret = new uint[](path.length);
        for (uint i = 0; i < path.length; i++) {
            ret[i] = path[i];
        }

        return ret;
    }

    // ------------------- internal function -------------------
    function getRandNum_(address user) internal view returns(uint) {
        return uint(keccak256(abi.encodePacked(user, block.difficulty, block.timestamp, block.coinbase, gasleft())));
    }

    function getRandNumFromSeed_(uint seed) internal view returns(uint) {
        return uint(keccak256(abi.encodePacked(seed, block.difficulty, block.timestamp, block.coinbase, gasleft())));
    }

}