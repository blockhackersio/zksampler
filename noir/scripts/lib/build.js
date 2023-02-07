const { compile, acir_to_bytes } = require("@noir-lang/noir_wasm");
const {
  setup_generic_prover_and_verifier,
} = require("@noir-lang/barretenberg/dest/client_proofs");
const { writeFileSync } = require("fs");
const path = require("path");

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

async function compileNoir(name) {
  const paths = {
    input: path.resolve(__dirname, `../../src/${name}.nr`),
    acir: path.resolve(__dirname, `../../build/${name}_acir.buf`),
    verifier: path.resolve(__dirname, `../../build/${name}_noir.sol`),
  };

  console.log(`Compiling ${paths.input}`);
  const compiled = compile(paths.input);
  const acir = compiled.circuit;
  console.log("Setting up generic prover and verifier...");
  let [, verifier] = await setup_generic_prover_and_verifier(acir);
  console.log(`Exporting Smart Contract to ${paths.verifier}...`);
  const sc = verifier
    .SmartContract()
    .replace("TurboVerifier", `${capitalize(name)}VerifierNoir`);
  writeFileSync(paths.verifier, sc, { flag: "w" });
  writeFileSync(paths.acir, Buffer.from(acir_to_bytes(acir)), { flag: "w" });
}

async function main() {
  const name = process.argv[2];
  if (!name) {
    throw new Error(`No name provided`);
  }
  await compileNoir(name);
}

main()
  .then(() => process.exit())
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
