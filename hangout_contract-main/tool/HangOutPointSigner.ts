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
    Claim: [
      { name: "claimer", type: "address" },
      { name: "userNonce", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
  },
  primaryType: "Claim",
  domain: {
    name: "HangOut Point",
    version: "1",
    chainId: 31337,
    verifyingContract: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
  message: {
    claimer: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    userNonce: 1,
    amount: 20000,
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
