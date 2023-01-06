const hre = require("hardhat");
const ethers = hre.ethers;
const BigNumber = ethers.BigNumber;


module.exports = {
  localhost: {
    signer: "0x32839527871134A34b0cB115D9Ee7D14BAa8566F",
    fieldMerkleRoot: "0xdf6799abc28ffe813aa37e2323b07b94d83d26466d125062e61c20f66763c78c",
    landsMerkleRoot: "0xdf6799abc28ffe813aa37e2323b07b94d83d26466d125062e61c20f66763c78c"
  },

  bsc_testnet: {},

  bsc: {
    MarketSigner: "0x301643CfAe735d8CDa35AA3a04b088376C715513",
    MarketOwner: "0x301643CfAe735d8CDa35AA3a04b088376C715513",

    HOPOSigner: "0x301643CfAe735d8CDa35AA3a04b088376C715513",
    HOPOOwner: "0x114aAf5c28aB4DE3f7914A1B721B1E94A1aD89D1",
  },

  heco: {
    signer: "0x5E5EEDA79ff0Ca9003651D750D3238B9007fb7D7",
    fieldMerkleRoot: "0x1aa5d21e3926bf7ea541a358b61826a77c3f917c625b1a489eaad6965f59de07",
    landsMerkleRoot: "0x1aa5d21e3926bf7ea541a358b61826a77c3f917c625b1a489eaad6965f59de07"
  },

  rinkeby: {
    signer: "0x32839527871134A34b0cB115D9Ee7D14BAa8566F",
    fieldMerkleRoot: "0xdf6799abc28ffe813aa37e2323b07b94d83d26466d125062e61c20f66763c78c",
    landsMerkleRoot: "0xdf6799abc28ffe813aa37e2323b07b94d83d26466d125062e61c20f66763c78c",

    rawMaterialsBoxUri: "",
    rawMaterialsBoxName: "HO RawMaterialsBox",
    rawMaterialsBoxSymbol: "HORMB",

    psychedelicForestRootDesc: "You have entered the Psychedelic Forest, and those who enter it will unknowingly walk back to where they started. It is said that there are many treasures here, but very few people can find the treasure and bring it out of the forest safely.",
    psychedelicForestInterval: 60,

    HOPOSigner: "0xb550f64B675951Af40A63ce2d75EE0B9759455D7",
    HOPOOwner: "0x114aAf5c28aB4DE3f7914A1B721B1E94A1aD89D1",
  },

  goerli: {
    signer: "0x32839527871134A34b0cB115D9Ee7D14BAa8566F",
    fieldMerkleRoot: "0xdf6799abc28ffe813aa37e2323b07b94d83d26466d125062e61c20f66763c78c",
    landsMerkleRoot: "0xdf6799abc28ffe813aa37e2323b07b94d83d26466d125062e61c20f66763c78c",

    rawMaterialsBoxUri: "",
    rawMaterialsBoxName: "HO RawMaterialsBox",
    rawMaterialsBoxSymbol: "HORMB",

    psychedelicForestRootDesc: "You have entered the Psychedelic Forest, and those who enter it will unknowingly walk back to where they started. It is said that there are many treasures here, but very few people can find the treasure and bring it out of the forest safely.",
    psychedelicForestInterval: 60,

    MarketSigner: "0xb550f64B675951Af40A63ce2d75EE0B9759455D7",
    MarketOwner: "0xb550f64B675951Af40A63ce2d75EE0B9759455D7",

    HOPOSigner: "0xb550f64B675951Af40A63ce2d75EE0B9759455D7",
    HOPOOwner: "0x114aAf5c28aB4DE3f7914A1B721B1E94A1aD89D1",
  },

  ethtest: {
    signer: "0x5E5EEDA79ff0Ca9003651D750D3238B9007fb7D7",
    fieldMerkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
    landsMerkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000"
  },

  ethereum: {
    signer: "0x2E6567D9a58559D667538f3efDFF6161a85595d1",
    fieldMerkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
    landsMerkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000"
  }

}