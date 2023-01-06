const hre = require("hardhat");
const ethers = hre.ethers;
const fs = require('fs');

async function getAccountNonce() {
  let data = fs.readFileSync('./tool/account.data');
  data = data.toString();
  const accArr = data.split('\n');
  console.log(`total account count: ${accArr.length}`);
  for (let i = 58; i < accArr.length; i++) {
    console.log(`${i} account (${accArr[i]}) nonce: ${await ethers.provider.getTransactionCount(accArr[i])}`);
  }
}


async function main() {
  await getAccountNonce();
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
