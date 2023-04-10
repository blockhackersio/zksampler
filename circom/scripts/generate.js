// import { buildBabyjub } from "circomlibjs";
// import { Scalar } from "ffjavascript";
// import { wasm as wasm_tester } from "circom_tester";
const { default: MerkleTree, PartialMerkleTree } = require("fixed-merkle-tree");
const { buildPoseidon } = require("circomlibjs");
const ethers = require("ethers");
const { encrypt, decrypt, getEncryptionPublicKey } = require("eth-sig-util");
const { BigNumber } = ethers;
// const { poseidonHash, toFixedHex } = require("./utils");

function packEncryptedMessage(encryptedMessage) {
  const nonceBuf = Buffer.from(encryptedMessage.nonce, "base64");
  const ephemPublicKeyBuf = Buffer.from(
    encryptedMessage.ephemPublicKey,
    "base64"
  );
  const ciphertextBuf = Buffer.from(encryptedMessage.ciphertext, "base64");
  const messageBuff = Buffer.concat([
    Buffer.alloc(24 - nonceBuf.length),
    nonceBuf,
    Buffer.alloc(32 - ephemPublicKeyBuf.length),
    ephemPublicKeyBuf,
    ciphertextBuf,
  ]);
  return "0x" + messageBuff.toString("hex");
}

function unpackEncryptedMessage(encryptedMessage) {
  if (encryptedMessage.slice(0, 2) === "0x") {
    encryptedMessage = encryptedMessage.slice(2);
  }
  const messageBuff = Buffer.from(encryptedMessage, "hex");
  const nonceBuf = messageBuff.slice(0, 24);
  const ephemPublicKeyBuf = messageBuff.slice(24, 56);
  const ciphertextBuf = messageBuff.slice(56);
  return {
    version: "x25519-xsalsa20-poly1305",
    nonce: nonceBuf.toString("base64"),
    ephemPublicKey: ephemPublicKeyBuf.toString("base64"),
    ciphertext: ciphertextBuf.toString("base64"),
  };
}

class Keypair {
  /**
   * Initialize a new keypair. Generates a random private key if not defined
   *
   * @param {string} privkey
   */
  constructor(privkey = ethers.Wallet.createRandom().privateKey) {
    this.privkey = privkey;
    this.pubkey = poseidonHash([this.privkey]);
    this.encryptionKey = getEncryptionPublicKey(privkey.slice(2));
  }

  toString() {
    return (
      toFixedHex(this.pubkey) +
      Buffer.from(this.encryptionKey, "base64").toString("hex")
    );
  }

  /**
   * Key address for this keypair, alias to {@link toString}
   *
   * @returns {string}
   */
  address() {
    return this.toString();
  }

  /**
   * Initialize new keypair from address string
   *
   * @param str
   * @returns {Keypair}
   */
  static fromString(str) {
    if (str.length === 130) {
      str = str.slice(2);
    }
    if (str.length !== 128) {
      throw new Error("Invalid key length");
    }
    return Object.assign(new Keypair(), {
      privkey: null,
      pubkey: BigNumber.from("0x" + str.slice(0, 64)),
      encryptionKey: Buffer.from(str.slice(64, 128), "hex").toString("base64"),
    });
  }

  /**
   * Sign a message using keypair private key
   *
   * @param {string|number|BigNumber} commitment a hex string with commitment
   * @param {string|number|BigNumber} merklePath a hex string with merkle path
   * @returns {BigNumber} a hex string with signature
   */
  sign(commitment, merklePath) {
    return poseidonHash([this.privkey, commitment, merklePath]);
  }

  /**
   * Encrypt data using keypair encryption key
   *
   * @param {Buffer} bytes
   * @returns {string} a hex string with encrypted data
   */
  encrypt(bytes) {
    return packEncryptedMessage(
      encrypt(
        this.encryptionKey,
        { data: bytes.toString("base64") },
        "x25519-xsalsa20-poly1305"
      )
    );
  }

  /**
   * Decrypt data using keypair private key
   *
   * @param {string} data a hex string with data
   * @returns {Buffer}
   */
  decrypt(data) {
    return Buffer.from(
      decrypt(unpackEncryptedMessage(data), this.privkey.slice(2)),
      "base64"
    );
  }
}

const crypto = require("crypto");

const randomBN = (nbytes = 31) => BigNumber.from(crypto.randomBytes(nbytes));

const toBuffer = (value, length) =>
  Buffer.from(
    BigNumber.from(value)
      .toHexString()
      .slice(2)
      .padStart(length * 2, "0"),
    "hex"
  );

class Utxo {
  constructor({
    amount = 0,
    keypair = new Keypair(),
    blinding = randomBN(),
    index = null,
  } = {}) {
    this.amount = BigNumber.from(amount);
    this.blinding = BigNumber.from(blinding);
    this.keypair = keypair;
    this.index = index;
  }
  toString() {
    const amount = this.amount.toString();
    const blinding = this.blinding.toHexString();
    const keypair = this.keypair.pubkey.toHexString();
    const index = this.index;

    return JSON.stringify({ amount, blinding, keypair, index });
  }
  getCommitment() {
    if (!this._commitment) {
      this._commitment = poseidonHash([
        this.amount,
        this.keypair.pubkey,
        this.blinding,
      ]);
    }
    return this._commitment;
  }

  getNullifier() {
    if (!this._nullifier) {
      if (
        this.amount > 0 &&
        (this.index === undefined ||
          this.index === null ||
          this.keypair.privkey === undefined ||
          this.keypair.privkey === null)
      ) {
        throw new Error(
          "Can not compute nullifier without utxo index or private key"
        );
      }
      const signature = this.keypair.privkey
        ? this.keypair.sign(this.getCommitment(), this.index || 0)
        : 0;
      this._nullifier = poseidonHash([
        this.getCommitment(),
        this.index || 0,
        signature,
      ]);
    }
    return this._nullifier;
  }

  encrypt() {
    const bytes = Buffer.concat([
      toBuffer(this.amount, 31),
      toBuffer(this.blinding, 31),
    ]);
    return this.keypair.encrypt(bytes);
  }

  static decrypt(keypair, data, index) {
    const buf = keypair.decrypt(data);
    return new Utxo({
      amount: BigNumber.from("0x" + buf.slice(0, 31).toString("hex")),
      blinding: BigNumber.from("0x" + buf.slice(31, 62).toString("hex")),
      keypair,
      index,
    });
  }
}
let poseidon;

const poseidonHash = (items) => {
  return BigNumber.from(poseidon(items));
};
const poseidonHash2 = (a, b) => poseidonHash([a, b]);

function toFixedHex(number, length = 32) {
  let result =
    "0x" +
    (number instanceof Buffer
      ? number.toString("hex")
      : BigNumber.from(number).toHexString().replace("0x", "")
    ).padStart(length * 2, "0");
  if (result.indexOf("-") > -1) {
    result = "-" + result.replace("-", "");
  }
  return result;
}

async function main() {
  poseidon = await buildPoseidon();

  const alice = new Keypair();
  const coinA = new Utxo({
    amount: 100,
    keypair: alice,
    blinding: randomBN(),
    index: null,
  });

  const comm1 = coinA.getCommitment();

  const coinAEncrypted = coinA.encrypt();

  const tree = new MerkleTree(5, [comm1], {
    hashFunction: poseidonHash2,
  });

  console.log({
    coinA: coinA.toString(),
    coinAEncrypted,
    root: tree.root.toHexString(),
  });

  const circuit = await wasm_tester(
    path.join(__dirname, "../src/transaction.circom")
  );

  // circuit.
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
