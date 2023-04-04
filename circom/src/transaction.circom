pragma circom 2.0.0;

include "./transaction/transaction.circom";

component main { 
  public [
    publicAmount,
    extDataHash,
    inputNullifier,
    outputCommitment
  ] 
} = Transaction(5, 2, 2, 11850551329423159860688778991827824730037759162201783566284850822760196767874);
