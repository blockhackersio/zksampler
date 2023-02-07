#!/bin/bash

FNAME=$1

snarkjs plonk verify ./build/${FNAME}_verification_key.json ./build/${FNAME}_public.json ./build/${FNAME}_proof.json