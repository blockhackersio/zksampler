# ZK Sampler

This repo demonstrates various circuits using various ZK protocols. It is a work in progress but can act as a good example of how to setup end to end Zero Knowledge Proofs using various proving languages and systems.

So far we have:

- [x] Multiplication of two fields
  - [x] Noir (TurboPlonk)
  - [x] Circom (Plonk)
- [x] Chained multiplication of three fields
  - [x] Noir (TurboPlonk)
  - [x] Circom (Plonk)
- [x] Pederson hash of a secret string
  - [x] Noir (TurboPlonk)
  - [x] Circom (Plonk)
- [ ] Merkle tree inclusion proof
  - [ ] Noir (TurboPlonk)
  - [-] Circom (Plonk)
- [ ] Tornado style Darkpool 
  - [ ] Noir (TurboPlonk)
  - [ ] Circom (Plonk)
- [ ] utx0 Darkpool 
  - [ ] Noir (TurboPlonk)
  - [ ] Circom (Plonk)


# Requirements

- Node v18.13.0
- snarkjs 0.5.0
- nargo 0.1
- circom compiler 2.1.3
- pnpm 7.26.0

# Install dependencies

```bash
pnpm install # will download ptau file
```

# Build project

```bash
pnpm build --force
```

# Run frontend

```bash
pnpm dev
```

# Build and prove circom circuits locally

```bash
cd circom
pnpm build
pnpm prove
pnpm verify
```

# Build and prove noir circuits locally

```bash
cd noir
pnpm build
./scripts/prove.sh multiplication | ./scripts/verify.sh multiplication
./scripts/prove.sh double | ./scripts/verify.sh double
./scripts/prove.sh pedersen | ./scripts/verify.sh pedersen
```
