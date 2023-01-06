const hre = require("hardhat");
const ethers = hre.ethers;
const deployResult = require('../deploy/deploy_result');
const deployConfig = require("../deploy/deploy_config")[hre.network.name];


async function getTMerkleTree() {
  return await ethers.getContractAt(deployResult.getData().deployedContract.tMerkleTree.contractName, deployResult.getData().deployedContract.tMerkleTree.address);
}

async function setRoots(root1k, root10k) {
  console.log("setRoots begin");
  const tMerkleTree = await getTMerkleTree();
  await (await tMerkleTree.setRoots(root1k, root10k)).wait();
  console.log("setRoots end");
}

async function check1k(proof) {
  console.log("check1k begin");
  const tMerkleTree = await getTMerkleTree();
  await (await tMerkleTree.check1k(proof)).wait();
  console.log("check1k end");
}

async function check10k(proof) {
  console.log("check10k begin");
  const tMerkleTree = await getTMerkleTree();
  await (await tMerkleTree.check10k(proof)).wait();
  console.log("check10k end");
}

async function main() {
  const [sender] = await ethers.getSigners();
  console.log("network:", hre.network.name);
  console.log("sender:", sender.address);

  await deployResult.load();

  const root1k = '0x9f7305f8e39c2e4ed1085d6468f61323041437ab448e28aae364f5a34d97b38d';
  const root10k = '0x7069ad9d2078dc107f3787e86f3b94b261be2a5ff5636f85c29ff62c80ad8fb5';
  const proof1k = [
    '0x0000000000000000000000000000000000000000000000000000000000000001',
    '0xc3a24b0501bd2c13a7e57f2db4369ec4c223447539fc0724a9d55ac4a06ebd4d',
    '0x2bd9d15b668ce2417da366385e2b2df2464f3254095e66a52b6436412509ffee',
    '0xd214d5ae8eb872f12fe0a1561729a7ba78a4bb7e6edc85c10e43468787befb7c',
    '0x589074d01d28b162439c7fb9f200ba5b14b19cbf42683da3e5df0ffaacd47cd0',
    '0x3696f5635163ead6abbcff9bc14104efb61248924a0f167e89d246a87b9215ec',
    '0xfa1b0e8b92d2a648497c9f615c2f1b24c4b53adf4855de6ea2925a5b66bd9da5',
    '0x9a879f1cd88c69b7fc9c969a8ad5a67cce866a3d59adb2175e16f954692cd4f8',
    '0x551b45dcb2020c91aa27120f5d09a45e60db95bff03dfd72975c660f4917b418',
    '0x64c68a931d2f903b53a3592f7b9218c29703e3fa230930b0ebd924ce2a239dd5'
  ];
  const proof10k = [
    '0x0000000000000000000000000000000000000000000000000000000000000001',
    '0xc3a24b0501bd2c13a7e57f2db4369ec4c223447539fc0724a9d55ac4a06ebd4d',
    '0x2bd9d15b668ce2417da366385e2b2df2464f3254095e66a52b6436412509ffee',
    '0xd214d5ae8eb872f12fe0a1561729a7ba78a4bb7e6edc85c10e43468787befb7c',
    '0x589074d01d28b162439c7fb9f200ba5b14b19cbf42683da3e5df0ffaacd47cd0',
    '0x3696f5635163ead6abbcff9bc14104efb61248924a0f167e89d246a87b9215ec',
    '0xfa1b0e8b92d2a648497c9f615c2f1b24c4b53adf4855de6ea2925a5b66bd9da5',
    '0x9a879f1cd88c69b7fc9c969a8ad5a67cce866a3d59adb2175e16f954692cd4f8',
    '0x551b45dcb2020c91aa27120f5d09a45e60db95bff03dfd72975c660f4917b418',
    '0xf25fc5ed8ebfbbe894c37edd3586ea23c1f5a4fdf1ac6871fa1c233270b47685',
    '0x60ece048a9d18694358a8dddfeef67c927ea24dcc9b8c1cf278eb83003007907',
    '0xcce4eba6b7c07bb14e2c3069e3ac93d3286fa3e4c8a005f1e3429f10b4cf92c3',
    '0x382ebb6a4fa6f89241fc2f8b809341b3fd6115c96d1fd2b327267c273c6d6b88',
    '0xe86a2bab49fb54ad4fa5ffe5055c83d64de73a6804bba0847537e3e5cde1143c'
  ];

  // await setRoots(root1k, root10k);
  await check1k(proof1k);
  await check10k(proof10k);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
