pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/pedersen.circom";

template Main() {
    signal input secret;
    signal output out;

    component secretHasher = Pedersen(248);
    component secretBits = Num2Bits(248);
    secretBits.in <== secret;
    for (var i = 0; i < 248; i++) {
        secretHasher.in[i] <== secretBits.out[i];
    }

    out <== secretHasher.out[0];
}

component main = Main();