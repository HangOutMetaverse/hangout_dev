const hre = require("hardhat");
const ethers = hre.ethers;
const deployResult = require("../deploy/deploy_result");
const deployConfig = require("../deploy/deploy_config")[hre.network.name];

let rawMaterialsBox;
let psychedelicForest;

async function getContract() {
  rawMaterialsBox = await ethers.getContractAt(deployResult.getData().deployedContract.rawMaterialsBox.contractName, deployResult.getData().deployedContract.rawMaterialsBox.address);
  psychedelicForest = await ethers.getContractAt(deployResult.getData().deployedContract.psychedelicForest.contractName, deployResult.getData().deployedContract.psychedelicForest.address);
}

async function cfgRawMaterialsBox() {
  await (await rawMaterialsBox.setMinter(psychedelicForest.address, true)).wait();
  console.log(`psychedelicForest is minter : ${await rawMaterialsBox.minters(psychedelicForest.address)}`);
}

async function cfgPsychedelicForestBox() {
  await (await psychedelicForest.setRawMaterialsBox(rawMaterialsBox.address, 0)).wait();
  console.log(`rawMaterialsBox: ${await psychedelicForest.rawMaterialsBox()}`);
  console.log(`rawMaterialsBoxId: ${await psychedelicForest.rawMaterialsBoxId()}`);
}

async function cfgPsychedelicForestLevels() {
  const levels = [
    {
      path: [],
      subItems: [
        {
          description: "You enter the Psychedelic Forest bravely, and at a fork in the road, you choose to go to the right, which appears to be a path into the forest depths.",
          probability: 4900,
          dropLoot: false,
          subLevelCount: 0,
        },
        {
          description: "You enter the Psychedelic Forest bravely, and at a fork in the road, you choose to go to the left, which appears to be the path to the forest depths.",
          probability: 4900,
          dropLoot: false,
          subLevelCount: 0,
        },
        {
          description: "You decided to turn around and go back but accidentally found a treasure chest, and you walked out of the Psychedelic Forest with the treasure!",
          probability: 200,
          dropLoot: false,
          subLevelCount: 0,
        },
      ],
    },
    {
      path: [0],
      subItems: [
        {
          description: "You keep moving forward. The forest gradually fogged up until you could not see the road ahead. You push forward, trusting your intuition.",
          probability: 9500,
          dropLoot: false,
          subLevelCount: 0,
        },
        {
          description: "As you keep walking forward, a thick fog gradually forms in the forest. You grope in the thick fog until you find a direction where the fog becomes lighter.",
          probability: 500,
          dropLoot: false,
          subLevelCount: 0,
        },
      ],
    },
    {
      path: [1],
      subItems: [
        {
          description: "You keep moving forward and find that the fog is not your greatest problem — There is only one path to walk, yet you keep going in circles!",
          probability: 8500,
          dropLoot: false,
          subLevelCount: 0,
        },
        {
          description: "As you keep moving forward, the fog in the forest gets thicker, and you can barely see anything ahead.",
          probability: 1500,
          dropLoot: false,
          subLevelCount: 0,
        },
      ],
    },
    {
      path: [0, 0],
      subItems: [
        {
          description: "You keep moving forward until you see an exit, but it turns out it's the same entrance where you began your journey. You have failed!",
          probability: 5000,
          dropLoot: false,
          subLevelCount: 0,
        },
        {
          description: "You make your way forward and see an exit. Next to the exit, you see a wooden box, and you excitedly run to open it. You find that there is nothing inside, and you return empty-handed.",
          probability: 4500,
          dropLoot: false,
          subLevelCount: 0,
        },
        {
          description: "You make your way forward and see an exit. Next to the exit, you see a big box. You run to open it excitedly but find only common treasure inside.",
          probability: 500,
          dropLoot: true,
          subLevelCount: 0,
        },
      ],
    },
    {
      path: [0, 1],
      subItems: [
        {
          description: "You keep moving forward until you see an exit, but it turns out it's the same entrance where you began your journey. You have failed!",
          probability: 2000,
          dropLoot: false,
          subLevelCount: 0,
        },
        {
          description: "Your intuition is highly accurate! You find the treasure chest hidden deep within the forest, obtain the treasure inside, and escape the forest happily.",
          probability: 8000,
          dropLoot: true,
          subLevelCount: 0,
        },
      ],
    },
    {
      path: [1, 0],
      subItems: [
        {
          description: "You go with the flow, but the trail goes on for too long, and you lose the ability to think. Eventually, you see an exit — the entrance from which you came! You have failed the quest.",
          probability: 9500,
          dropLoot: false,
          subLevelCount: 0,
        },
        {
          description: "You try your best to stay calm and think as you walk. Eventually, you find a hidden hole around a corner. Inside the hole is a treasure chest! You take the treasure and find your way out of the Psychedelic Forest.",
          probability: 500,
          dropLoot: true,
          subLevelCount: 0,
        },
      ],
    },
    {
      path: [1, 1],
      subItems: [
        {
          description: "It's a tough road. In the fog, you can't see anything, and you trip and roll down a slope. You stand up and look around — you're back where you started! You've failed the quest.",
          probability: 7000,
          dropLoot: false,
          subLevelCount: 0,
        },
        {
          description: "It's a difficult road — You can't see anything clearly. But with amazing luck, you fumbled to the large treasure chest deep in the forest! You take the treasure from inside the chest.",
          probability: 3000,
          dropLoot: false,
          subLevelCount: 0,
        },
      ],
    },
    {
      path: [1, 1, 1],
      subItems: [
        {
          description: "By the time you return, the fog has disappeared, and you can easily walk out of the Psychedelic Forest.",
          probability: 9000,
          dropLoot: true,
          subLevelCount: 0,
        },
        {
          description: "The fog is still thick. You hold the treasure in your hand and don't let go, but you lose your balance. During the fall, the treasure disappears, and you go back empty-handed.",
          probability: 1000,
          dropLoot: false,
          subLevelCount: 0,
        },
      ],
    },
  ];

  for (let i = 0; i < levels.length; i++) {
    console.log(`begin setLevels: ${i}`);
    console.log(levels[i].path);
    console.log(levels[i].subItems);
    await (await psychedelicForest.setLevels(levels[i].path, levels[i].subItems)).wait();
    console.log(`getSubLevels:${await psychedelicForest.getSubLevels(levels[i].path)}`);
    console.log(`end setLevels: ${i}`);
  }

  console.log("cfgPsychedelicForestLevels end");
}

async function startPsychedelicForestLevels(start) {
  await (await psychedelicForest.setStart(start)).wait();
  console.log(`is start: ${await psychedelicForest.start()}`);
}

async function setPsychedelicForestRootDescription() {
  await (await psychedelicForest.setRootDescription(deployConfig.psychedelicForestRootDesc)).wait();
  console.log(`levelRoot: ${await psychedelicForest.levelRoot()}`);
}

async function main() {
  const [sender] = await ethers.getSigners();
  console.log("network:", hre.network.name);
  console.log("sender:", sender.address);

  console.log("begin load deployResult");
  await deployResult.load();

  console.log("begin getContract");
  await getContract();

  // console.log("begin cfgRawMaterialsBox");
  // await cfgRawMaterialsBox();

  // console.log("begin cfgPsychedelicForestBox");
  // await cfgPsychedelicForestBox();

  console.log("begin startPsychedelicForestLevels");
  await startPsychedelicForestLevels(false);

  console.log("begin setPsychedelicForestRootDescription");
  await setPsychedelicForestRootDescription();

  console.log("begin cfgPsychedelicForestLevels");
  await cfgPsychedelicForestLevels();

  console.log("begin startPsychedelicForestLevels");
  await startPsychedelicForestLevels(true);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
