export interface IPedersenProver {
  generateHash(secret: string): Promise<string>;
  generateProof(secret: string, hash: string): Promise<string>;
  verify(proof: string, hash: string): Promise<boolean>;
}
