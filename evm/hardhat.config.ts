import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.15",
    settings: {
      evmVersion: "london",
      optimizer: { enabled: true, runs: 5000 },
    },
  },
};

export default config;
