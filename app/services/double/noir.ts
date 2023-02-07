import { IDoubleProver } from "./types";
import { getContractAddress } from "../contracts";
import { generateProof, verify } from "@zksampler/noir-utils";

export class NoirDoubleProover implements IDoubleProver {
  async generateProof(
    a: number,
    b: number,
    c: number,
    d: number
  ): Promise<string> {
    return await generateProof("/double_acir.buf", { a, b, c, d });
  }

  async verify(proof: string): Promise<boolean> {
    console.log("Verifying proof using NOIR");
    return await verify(getContractAddress("doubleNoir"), proof);
  }

  static new() {
    return new NoirDoubleProover();
  }
}
