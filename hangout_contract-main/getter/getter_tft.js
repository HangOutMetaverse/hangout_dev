const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const abi = [
    'function name() external view returns (string memory)',
    'function symbol() public view returns (string memory)',
    'function decimals() public view returns (uint8)',
    'function totalSupply() public view returns (uint256)',
    'function balanceOf(address account) public view returns (uint256)',
    'function transfer(address to, uint256 amount) external returns (bool)',
  ];

  const tft = await ethers.getContractAt(abi, '0xb83E48735CCE025F75956b0abE7fA365A7d5705c');
  console.log(`${await tft.totalSupply()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
