import {defineChain} from "thirdweb";

export const hedara = defineChain({
  name: "Hedera TESTNET",
  nativeCurrency: {
      name: "HBAR", symbol: "HBAR"
  },
  testnet: true,
  id: 296,
  rpc: "https://testnet.hashio.io/api",
  blockExplorers: [{
      name: "NA",
      url: "https://testnet.hashio.io"
  }]
});

export const oasis = defineChain({
    name: "Oasis Sapphire Testnet",
    nativeCurrency: {
        name: "Matic"
    },
    testnet: true,
    id: 23295,
    rpc: "https://1rpc.io/oasis/sapphire",
    blockExplorers: [{
        name: "NA",
        url: "https://explorer.oasis.io/mainnet/sapphire"
    }]
});
  
export const arbitrum = defineChain({
    name: "Arbitrum Goerli",
    nativeCurrency: {
        name: "AGOR"
    },
    testnet: true,
    id: 421613,
    rpc: "https://arbitrum-goerli-rpc.publicnode.com",
    blockExplorers: [{
        name: "NA",
        url: "https://arbiscan.io/"
    }]
});
