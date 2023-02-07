import { ethers } from "ethers";
import { plonk } from "snarkjs";
import { getContractAddress } from "../contracts";
import { IPedersenProver } from "./types";
import { buildPedersenHash, buildBabyjub } from "circomlibjs";
import { utils, ZqField, Scalar } from "ffjavascript";

const F = new ZqField(
  Scalar.fromString(
    "21888242871839275222246405745257275088548364400416034343698204186575808495617"
  )
);

async function pedersenHash(data: any) {
  const pedersen = await buildPedersenHash();
  const babyJub = await buildBabyjub();
  const [hash] = babyJub.unpackPoint(pedersen.hash(data));
  return hash;
}

export class CircomPedersenProover implements IPedersenProver {
  async generateHash(secret: string): Promise<string> {
    const preimage = Buffer.alloc(31);
    preimage.write(secret, "utf-8");
    const hash = await pedersenHash(preimage);
    // Not 100% sure how this works to fix hash serialization but I got the following from here
    // https://github.com/iden3/circomlib/issues/77#issuecomment-1294912892
    return utils.stringifyBigInts(F.fromRprLEM(hash));
  }

  async generateProof(secret: string, hash: string): Promise<string> {
    console.log("Generating proof using CIRCOM");

    // Create a preimage buffer containing the secret
    const preimage = Buffer.alloc(31);
    preimage.write(secret, "utf-8");

    // convert to an int from little endian buffer to be compatible with circom
    const secretAsInt = utils.leBuff2int(preimage);

    const { proof } = await plonk.fullProve(
      { secret: secretAsInt },
      `/pedersen.wasm`,
      `/pedersen.zkey`
    );
    const calldata = await plonk.exportSolidityCallData(proof, [hash]);
    const [proofString] = calldata.split(",");
    return proofString;
  }

  async verify(proof: string, hash: string): Promise<boolean> {
    console.log("Verifying proof using CIRCOM");
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const verifierContract = new ethers.Contract(
      getContractAddress("pedersenCircom"),
      new ethers.utils.Interface([
        "function verifyProof(bytes memory proof, uint[] memory pubSignals) public view returns (bool)",
      ]),
      signer
    );
    return await verifierContract.verifyProof(proof, [hash]);
  }
  static new() {
    return new CircomPedersenProover();
  }
}
