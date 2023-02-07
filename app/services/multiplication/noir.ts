import { IMultiplicationProver } from "./types";
import { getContractAddress } from "../contracts";
import { generateProof, verify } from "@zksampler/noir-utils";

export class NoirMultiplicationProover implements IMultiplicationProver {
  async generateProof(a: number, b: number, c: number): Promise<string> {
    return await generateProof("/multiplication_acir.buf", { a, b, c });
  }

  async verify(proof: string, pubOut: number): Promise<boolean> {
    console.log("Verifying proof using NOIR");
    return await verify(getContractAddress("multiplicationNoir"), proof);
  }

  static new() {
    return new NoirMultiplicationProover();
  }
}
