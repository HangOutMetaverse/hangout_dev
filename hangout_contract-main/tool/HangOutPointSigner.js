"use strict";
exports.__esModule = true;
var eip_712_1 = require("eip-712");
var ethers_1 = require("ethers");
var typedData = {
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
        ]
    },
    primaryType: "Claim",
    domain: {
        name: "HangOut Point",
        version: "1",
        chainId: 31337,
        verifyingContract: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    },
    message: {
        claimer: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        userNonce: 1,
        amount: 20000
    }
};
function main() {
    var privateKey = process.env.privateKey;
    if (privateKey === undefined) {
        console.log("invalid private key");
        return;
    }
    var buffer = Buffer.from(privateKey.slice(2), "hex");
    var signingKey = new ethers_1.utils.SigningKey(buffer);
    var messageHash = (0, eip_712_1.getMessage)(typedData, true);
    var _a = signingKey.signDigest(messageHash), r = _a.r, s = _a.s, v = _a.v;
    var signature = r + s.slice(2) + v.toString(16);
    console.log("messageHash: ".concat(Buffer.from(messageHash).toString("hex")));
    console.log("Signature: (".concat(r, ", ").concat(s, ", ").concat(v, ")"));
    console.log("signature: ".concat(signature));
}
main();
