#!/bin/bash

FNAME=$1
snarkjs zkey export verificationkey build/${FNAME}.zkey build/${FNAME}_verification_key.json

node ./build/${FNAME}_js/generate_witness.js ./build/${FNAME}_js/${FNAME}.wasm ./tests/${FNAME}.json ./build/${FNAME}_witness.wtns

snarkjs plonk prove ./build/${FNAME}.zkey ./build/${FNAME}_witness.wtns ./build/${FNAME}_proof.json ./build/${FNAME}_public.json