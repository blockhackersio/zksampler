const { BarretenbergWasm } = require("@noir-lang/barretenberg/dest/wasm");
const { SinglePedersen } = require("@noir-lang/barretenberg/dest/crypto");

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.log("No secret provided!");
    process.exit(1);
  }

  const passwordBuffer = Buffer.alloc(32);
  passwordBuffer.write(password, "utf-8");
  process.stderr.write(passwordBuffer.toString("hex") + "\n");
  const barretenberg = await BarretenbergWasm.new();
  const pedersen = new SinglePedersen(barretenberg);
  await pedersen.init();
  const hashed = pedersen.compressInputs([passwordBuffer]);
  process.stdout.write(hashed.toString("hex"));
}

main()
  .then(() => process.exit())
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
