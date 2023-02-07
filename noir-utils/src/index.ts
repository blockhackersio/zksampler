import { BarretenbergWasm } from "@noir-lang/barretenberg/dest/wasm";
import { SinglePedersen } from "@noir-lang/barretenberg/dest/crypto";
import loadNoirWasm, { acir_from_bytes } from "@noir-lang/noir_wasm";
import {
  setup_generic_prover_and_verifier,
  create_proof,
} from "@noir-lang/barretenberg/dest/client_proofs";
import { ethers } from "ethers";

export function utf8StringToBuffer(input: string, size = 32): Buffer {
  const buffer = Buffer.alloc(32);
  buffer.write(input, "utf-8");
  return buffer;
}

export function utf8StringToHexString(input: string, size = 32): string {
  return bufferToHexString(utf8StringToBuffer(input));
}

export function hexStringToBuffer(input: string): Buffer {
  return Buffer.from(input.replace(/^0x/, ""), "hex");
}

export function bufferToHexString(buffer: Buffer): string {
  return `0x${buffer.toString("hex")}`;
}

export async function pedersenHash(input: string): Promise<string> {
  const secretBuffer = utf8StringToBuffer(input);
  const barretenberg = await BarretenbergWasm.new();
  const pedersen = new SinglePedersen(barretenberg);
  const hashed = pedersen.compressInputs([secretBuffer]);
  return bufferToHexString(hashed);
}

export async function generateProof(
  pathToAcir: string,
  input: object
): Promise<string> {
  await loadNoirWasm();
  const acirBuffer = await fetch(pathToAcir).then((r) => r.arrayBuffer());
  const acir = acir_from_bytes(new Uint8Array(acirBuffer));
  const [prover] = await setup_generic_prover_and_verifier(acir);
  const proof = await create_proof(prover, acir, input);
  return bufferToHexString(proof);
}

export async function verify(contractAddress: string, proof: string) {
  const proofBuffer = hexStringToBuffer(proof);
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner();
  const verifierContract = new ethers.Contract(
    contractAddress,
    new ethers.utils.Interface([
      "function verify(bytes calldata) external view returns (bool result)",
    ]),
    signer
  );
  try {
    await verifierContract.verify(proofBuffer);
    return true;
  } catch (err) {
    return false;
  }
}
