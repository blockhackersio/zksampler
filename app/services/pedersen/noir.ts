import { IPedersenProver } from "./types";
import { getContractAddress } from "../contracts";
import {
  verify,
  generateProof,
  pedersenHash,
  utf8StringToHexString,
} from "@zksampler/noir-utils";

export class NoirPedersenProover implements IPedersenProver {
  async generateHash(secret: string): Promise<string> {
    return await pedersenHash(secret);
  }

  async generateProof(secret: string, hash: string): Promise<string> {
    return await generateProof("/pedersen_acir.buf", {
      secret: utf8StringToHexString(secret),
      hash,
    });
  }

  async verify(proof: string): Promise<boolean> {
    console.log("Verifying proof using NOIR");
    return await verify(getContractAddress("pedersenNoir"), proof);
  }

  static new() {
    return new NoirPedersenProover();
  }
}
