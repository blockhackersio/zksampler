# ZK Sampler

This repo demonstrates various circuits using various ZK protocols

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

# Build and proove circom circuits locally

```bash
cd circom
pnpm build
pnpm prove
pnpm verify
```

# Build and proove noir circuits locally

```bash
cd noir
pnpm build
./scripts/prove.sh multiplication | ./scripts/verify.sh multiplication
./scripts/prove.sh double | ./scripts/verify.sh double
./scripts/prove.sh pedersen | ./scripts/verify.sh pedersen
```
