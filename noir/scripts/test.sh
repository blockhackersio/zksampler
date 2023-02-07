#!/bin/bash

./scripts/build.sh pedersen
./scripts/pedersen.sh hello > /tmp/pedersen_hello
echo "====="
echo "Hash:"
echo "====="
cat /tmp/pedersen_hello
cat /tmp/pedersen_hello | ./scripts/prove.sh pedersen > /tmp/pedersen_proof
echo ""
echo "======"
echo "Proof:"
echo "======"
cat /tmp/pedersen_proof
echo "============="
echo "Verification:"
echo "============="
cat /tmp/pedersen_proof | ./scripts/verify.sh pedersen

./scripts/build.sh multiplication
./scripts/prove.sh multiplication | ./scripts/verify.sh multiplication