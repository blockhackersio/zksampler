import { ethers } from "ethers";
import { plonk } from "snarkjs";
import { getContractAddress } from "../contracts";
import { IMultiplicationProver } from "./types";

export class CircomMultiplicationProover implements IMultiplicationProver {
  async generateProof(a: number, b: number, c: number): Promise<string> {
    console.log("Generating proof using CIRCOM");

    const { proof } = await plonk.fullProve(
      { a, b },
      `/multiplication.wasm`,
      `/multiplication.zkey`
    );

    const calldata = await plonk.exportSolidityCallData(proof, [c]);
    const [proofString] = calldata.split(",");

    return proofString;
  }
  async verify(proof: string, pubOut: number): Promise<boolean> {
    console.log("Verifying proof using CIRCOM");

    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();

    const verifierContract = new ethers.Contract(
      getContractAddress("multiplicationCircom"),
      new ethers.utils.Interface([
        "function verifyProof(bytes memory proof, uint[] memory pubSignals) public view returns (bool)",
      ]),
      signer
    );
    return await verifierContract.verifyProof(proof, [pubOut]);
  }
  static new() {
    return new CircomMultiplicationProover();
  }
}
