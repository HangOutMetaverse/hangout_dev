import { getMessage } from "eip-712";
import { utils } from "ethers";

const typedData = {
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
    exchange: [
      { name: "user", type: "address" },
      { name: "goodsId", type: "uint256" },
      { name: "goodsQuantity", type: "uint256" },
      { name: "money", type: "address" },
      { name: "moneyAmount", type: "uint256" },
      { name: "callTarget", type: "address" },
      { name: "callData", type: "bytes" },
      { name: "comment", type: "bytes" },
    ],
  },
  primaryType: "exchange",
  domain: {
    name: "HangOut Market V1",
    version: "1",
    chainId: 31337,
    verifyingContract: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  },
  message: {
    user: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    goodsId: 0,
    goodsQuantity: 1,
    money: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    moneyAmount: 1,
    callTarget: "0x0000000000000000000000000000000000000000",
    callData: "0x",
    comment: "0x11223344556677889900",
  },
};

function main() {
  const privateKey = process.env.privateKey;
  if (privateKey === undefined) {
    console.log(`invalid private key`);
    return;
  }

  const buffer = Buffer.from(privateKey.slice(2), "hex");
  const signingKey = new utils.SigningKey(buffer);
  const messageHash = getMessage(typedData, true);
  const { r, s, v } = signingKey.signDigest(messageHash);
  const signature = r + s.slice(2) + v.toString(16);
  console.log(`messageHash: ${Buffer.from(messageHash).toString("hex")}`);
  console.log(`Signature: (${r}, ${s}, ${v})`);
  console.log(`signature: ${signature}`);
}

main();
