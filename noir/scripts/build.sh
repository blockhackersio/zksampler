#!/bin/bash 

mkdir -p ./build

echo "Running build.js..."
node ./scripts/lib/build.js "$@"
echo "Copying verification contract to evm..."
cp ./build/*.sol ../evm/contracts/