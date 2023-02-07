#!/bin/bash 

pnpm concurrently "hardhat node" "sleep 2 && hardhat run --network localhost scripts/deploy.ts"