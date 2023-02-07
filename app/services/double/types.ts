export interface IDoubleProver {
  generateProof(a: number, b: number, c: number, d: number): Promise<string>;
  verify(proof: string, pubOut: number): Promise<boolean>;
}
