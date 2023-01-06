const hre = require("hardhat");
const ethers = hre.ethers;
const deployResult = require('../deploy/deploy_result');
const deployConfig = require("../deploy/deploy_config")[hre.network.name];


async function getEIP712Test() {
  return await ethers.getContractAt(deployResult.getData().deployedContract.eip712test.contractName, deployResult.getData().deployedContract.eip712test.address);
}

async function getHangOutETHFlatland() {
  return await ethers.getContractAt(
    deployResult.getData().deployedContract.hangOutETHFlatLand.contractName,
    deployResult.getData().deployedContract.hangOutETHFlatLand.address
  );
}

async function getChainId() {
  let eip712test = await getEIP712Test();
  let chainId = await eip712test.getChainId();
  console.log(chainId);
}

async function getDomainSeparatorV4BaseData() {
  let eip712test = await getEIP712Test();
  let baseData = await eip712test.getDomainSeparatorV4BaseData();
  console.log(baseData);
}

async function getDomainSeparatorV4() {
  let eip712test = await getEIP712Test();
  let domainSeparator = await eip712test.getDomainSeparatorV4();
  console.log(domainSeparator);
}

async function getMintCallHash() {
  let eip712test = await getEIP712Test();
  let minter = "0xa2D644EF59A735f6249D76aAB98F071523129Bb0";
  let ids = [1,2];

  let mintCallHash = await eip712test.getMintCallHash(minter, ids);
  console.log('getMintCallHash:', mintCallHash);
}

async function getTypedData() {
  let eip712test = await getEIP712Test();
  let minter = "0xa2D644EF59A735f6249D76aAB98F071523129Bb0";
  let ids = [1,2];

  let typedData = await eip712test.getTypedData(minter, ids);
  console.log("typedData:", typedData);
}

async function getTypedDataHash() {
  let eip712test = await getEIP712Test();
  let minter = "0x262CF2de08C618537Bc49b396b3a36a1F3F271d6";
  let ids = [0,1,2,3,4,5,6,7,8,9,10,11];

  let typedDataHash = await eip712test.getTypedDataHash(minter, ids);
  console.log("typedDataHash:", typedDataHash);
}

async function bytesParam() {
  let eip712test = await getEIP712Test();
  let bytes = '0x881dabb264dd9d56e325b13e6420d5dee7ca02cf20d073d2e813085a94e2779d30089a65f9cf81d063b152f3f381ddb74e2a4eb4fb3f167aaf3e819b03ca044d1c';
  let ret = await eip712test.bytesParam(bytes);
  console.log("bytesParam ret:", ret);
}

async function getEIP712Signer() {
  let eip712test = await getEIP712Test();
  let minter = "0xa2D644EF59A735f6249D76aAB98F071523129Bb0";
  let ids = [1,2,3];

  let signature = '0xd977795db43dad1002afb062769964379efd2ac7c0fe60937ac74dfb2fb65e5479fc048da308cb0b5633ff79af29431a3871aa29530b4442b9adb3fdc81198c01c';
  let signer = await eip712test.getEIP712Signer(minter, ids, signature);
  console.log("signer:", signer);
}

async function accountToleaf() {
  let hangOutLand = await getHangOutETHFlatland();
  let minter = "0x262CF2de08C618537Bc49b396b3a36a1F3F271d6";
  let leaf = await hangOutLand.accountToleaf(minter);
  console.log("leaf:", leaf);
}

async function verifyMerkle() {
  let hangOutLand = await getHangOutETHFlatland();
  let leaf = "0x000000000000000000000000262cf2de08c618537bc49b396b3a36a1f3f271d6";
  let proof = [
    '0x00000000000000000000000032839527871134a34b0cb115d9ee7d14baa8566f',
    '0xf886459b8cf0a5aba645dd03ed4642b74db545981fea2bafc75652b22374dfc8',
    '0x0000000000000000000000007f886a635eb30c681e43db2185dc29a2b5d0a8b6'
  ];
  let verify = await hangOutLand.verifyMerkle(leaf, proof);
  console.log("verify:", verify);
}

async function processMerkleProof() {
  let hangOutLand = await getHangOutETHFlatland();
  let leaf = "0x000000000000000000000000262cf2de08c618537bc49b396b3a36a1f3f271d6";
  let proof = [
    '0x00000000000000000000000032839527871134a34b0cb115d9ee7d14baa8566f'
  ];
  // let proof = [
  //   '0x00000000000000000000000032839527871134a34b0cb115d9ee7d14baa8566f',
  //   '0x76300a32cacdb65f9061028acb077aaf53c64dec0c2866a9dd1a49e6d57f63c0',
  //   '0x0000000000000000000000007f886a635eb30c681e43db2185dc29a2b5d0a8b6'
  // ];
  let root = await hangOutLand.processMerkleProof(leaf, proof);
  console.log("root:", root);
}

async function keccakBytes32() {
  const hangOutLand = await getHangOutETHFlatland();
  const leaf = "0x000000000000000000000000262cf2de08c618537bc49b396b3a36a1f3f271d6";
  const ret = await hangOutLand.keccakBytes32(leaf);
  console.log("ret:", ret);
}

async function tokenURI(tokenId) {
  const hangOutLand = await getHangOutETHFlatland();
  const ret = await hangOutLand.tokenURI(tokenId);
  console.log(tokenId.toString() + " URI:", ret);
}

async function getPrices() {
  const hangOutLand = await getHangOutETHFlatland();
  const ret = await hangOutLand.getPrices();
  console.log("prices:", ret);
  console.log(ethers.utils.formatEther(ret[0]));
  console.log(ethers.utils.formatEther(ret[1]));
  console.log(ethers.utils.formatEther(ret[2]));
}

async function getSceneState(sceneId) {
  console.log("begin getSceneState");
  console.log("scene display scene id", sceneId+1, ", backend id", sceneId);
  const hangOutLand = await getHangOutETHFlatland();
  const beginPlotId = sceneId*16;
  for (let i = beginPlotId; i < beginPlotId+16; i++) {
    try {
      const ret = await hangOutLand.ownerOf(i);
      console.log(i, 'owner', ret);
    } catch (e) {
      console.log(i, 'no owner');
    }
  }
}

async function getTotalSupply() {
  const hangOutLand = await getHangOutETHFlatland();
  console.log("totalSupply:", await hangOutLand.totalSupply());
}

async function getSigner() {
  const hangOutLand = await getHangOutETHFlatland();
  console.log("signer:", await hangOutLand.functions["signer"]());
  // console.log(hangOutLand.signer);
}

async function main() {
  await deployResult.load();

  // await getChainId();
  // await getDomainSeparatorV4BaseData();
  // await getDomainSeparatorV4();
  // await getMintCallHash();
  // await getTypedData();
  // await getTypedDataHash();
  // await bytesParam();
  // await getEIP712Signer();

  // await accountToleaf();
  // await verifyMerkle();
  // await processMerkleProof();
  // await keccakBytes32();

  await tokenURI(0);
  // await getPrices();

  // await getSceneState(88);

  // await getTotalSupply();
  // await getSigner();
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
