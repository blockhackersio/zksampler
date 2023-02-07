#!/bin/bash

capitalize()
{
  printf '%s' "$1" | head -c 1 | tr [:lower:] [:upper:]
  printf '%s' "$1" | tail -c '+2'
}

FNAME=$1
FNAME_CAPS=$(capitalize $FNAME) 

mkdir -p ./build

circom ./src/$FNAME.circom --r1cs --wasm -o ./build

snarkjs plonk setup ./build/$FNAME.r1cs ./pot/pot.ptau ./build/$FNAME.zkey

snarkjs zkey export solidityverifier ./build/${FNAME}.zkey ../evm/contracts/${FNAME}_circom.sol

sed -i "s/PlonkVerifier/${FNAME_CAPS}VerifierCircom/g" ../evm/contracts/${FNAME}_circom.sol