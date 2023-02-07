const { acir_from_bytes } = require("@noir-lang/noir_wasm");
const {
  setup_generic_prover_and_verifier,
  create_proof,
} = require("@noir-lang/barretenberg/dest/client_proofs");
const { readFileSync } = require("fs");
const path = require("path");

async function createProof(name) {
  const paths = {
    tests: path.resolve(__dirname, `../../tests/${name}.json`),
    acir: path.resolve(__dirname, `../../build/${name}_acir.buf`),
  };
  const inputs = JSON.parse(readFileSync(paths.tests));
  const acir = acir_from_bytes(readFileSync(paths.acir));
  const [prover] = await setup_generic_prover_and_verifier(acir);
  const proof = await create_proof(prover, acir, inputs);
  return proof.toString("hex");
}

async function main() {
  const name = process.argv[2];
  if (!name) {
    throw new Error(`No name provided`);
  }
  const proof = await createProof(name);
  process.stdout.write(proof);
}

main()
  .then(() => process.exit())
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
