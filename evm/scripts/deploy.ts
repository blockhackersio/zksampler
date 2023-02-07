import { ethers } from "hardhat";
import fs from "fs";
import { resolve } from "path";
async function main() {
  // MultiplicationVerifierCircom
  const MultiplicationVerifierCircom = await ethers.getContractFactory(
    "MultiplicationVerifierCircom"
  );
  const multiplicationCircom = await MultiplicationVerifierCircom.deploy();
  await multiplicationCircom.deployed();

  // DoubleVerifierCircom
  const DoubleVerifierCircom = await ethers.getContractFactory(
    "DoubleVerifierCircom"
  );
  const doubleCircom = await DoubleVerifierCircom.deploy();
  await doubleCircom.deployed();

  // PedersenVerifierCircom
  const PedersenVerifierCircom = await ethers.getContractFactory(
    "PedersenVerifierCircom"
  );
  const pedersenCircom = await PedersenVerifierCircom.deploy();
  await pedersenCircom.deployed();

  // MultiplicationVerifierNoir
  const MultiplicationVerifierNoir = await ethers.getContractFactory(
    "MultiplicationVerifierNoir"
  );
  const multiplicationNoir = await MultiplicationVerifierNoir.deploy();
  await multiplicationNoir.deployed();

  // PedersenVerifierNoir
  const PedersenVerifierNoir = await ethers.getContractFactory(
    "PedersenVerifierNoir"
  );
  const pedersenNoir = await PedersenVerifierNoir.deploy();
  await pedersenNoir.deployed();

  // DoubleVerifierNoir
  const DoubleVerifierNoir = await ethers.getContractFactory(
    "DoubleVerifierNoir"
  );
  const doubleNoir = await DoubleVerifierNoir.deploy();
  await doubleNoir.deployed();

  fs.writeFileSync(
    resolve(__dirname, "../deployments.json"),
    JSON.stringify(
      {
        doubleCircom: doubleCircom.address,
        doubleNoir: doubleNoir.address,
        multiplicationCircom: multiplicationCircom.address,
        multiplicationNoir: multiplicationNoir.address,
        pedersenCircom: pedersenCircom.address,
        pedersenNoir: pedersenNoir.address,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
