#!/bin/bash 

FNAME=multiplication

cp ../circom/build/${FNAME}_js/${FNAME}.wasm ./public
cp ../circom/build/${FNAME}.zkey ./public

FNAME=double

cp ../circom/build/${FNAME}_js/${FNAME}.wasm ./public
cp ../circom/build/${FNAME}.zkey ./public

FNAME=pedersen

cp ../circom/build/${FNAME}_js/${FNAME}.wasm ./public
cp ../circom/build/${FNAME}.zkey ./public

cp ../noir-utils/node_modules/@noir-lang/noir_wasm/noir_wasm_bg.wasm ./public/
cp ../noir-utils/node_modules/@noir-lang/aztec_backend/aztec_backend_bg.wasm ./public/
cp ../noir-utils/node_modules/@noir-lang/barretenberg/dest/worker.js ./public/
cp ../noir-utils/node_modules/@noir-lang/barretenberg/dest/wasm/barretenberg.wasm ./public/
cp ../noir/build/*.buf ./public/
cp ../evm/deployments.json ./config/deployments.json