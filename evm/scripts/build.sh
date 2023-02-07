#!/bin/bash

pnpm hardhat compile

pnpm concurrently -k "hardhat node" "sleep 2 && hardhat run --network localhost scripts/deploy.ts" || exit 0