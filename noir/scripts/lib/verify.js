const {
  setup_generic_prover_and_verifier,
  verify_proof,
} = require("@noir-lang/barretenberg/dest/client_proofs");
const { acir_from_bytes } = require("@noir-lang/noir_wasm");
const path = require("path");
const { readFileSync } = require("fs");

async function readIn() {
  return new Promise((res) => {
    process.stdin.on("readable", () => {
      let chunks = [];
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        chunks.push(chunk);
      }
      res(chunks.join(""));
    });
  });
}

async function validateNoir(proofAsChars, name) {
  const paths = {
    input: path.resolve(__dirname, `../../src/${name}.nr`),
    main: path.resolve(__dirname, `../../build/${name}.buf`),
    acir: path.resolve(__dirname, `../../build/${name}_acir.buf`),
    verifier: path.resolve(__dirname, `../../build/${name}_noir.sol`),
  };

  const acir = acir_from_bytes(readFileSync(paths.acir));
  let [, verifier] = await setup_generic_prover_and_verifier(acir);
  const proof = Buffer.from(proofAsChars, "hex");
  try {
    return await verify_proof(verifier, proof);
  } catch (err) {
    return false;
  }
}

async function main() {
  const name = process.argv[2];
  if (!name) {
    throw new Error(`No name provided`);
  }
  const prooffile = process.argv[3];
  const proofAsChars = !prooffile ? await readIn() : readFileSync(prooffile);
  const { default: chalk } = await import("chalk");

  const isVerified = await validateNoir(proofAsChars, name);
  console.log(
    isVerified
      ? chalk.green("Proof is VALID!") + " 😍"
      : chalk.red("Proof is INCORRECT!") + " 😭"
  );
}

main()
  .then(() => process.exit())
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
