export interface IMultiplicationProver {
  generateProof(a: number, b: number, c: number): Promise<string>;
  verify(proof: string, pubOut: number): Promise<boolean>;
}
