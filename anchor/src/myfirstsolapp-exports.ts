// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import MyfirstsolappIDL from '../target/idl/myfirstsolapp.json'
import type { Myfirstsolapp } from '../target/types/myfirstsolapp'

// Re-export the generated IDL and type
export { Myfirstsolapp, MyfirstsolappIDL }

// The programId is imported from the program IDL.
export const MYFIRSTSOLAPP_PROGRAM_ID = new PublicKey(MyfirstsolappIDL.address)

// This is a helper function to get the Myfirstsolapp Anchor program.
export function getMyfirstsolappProgram(provider: AnchorProvider) {
  return new Program(MyfirstsolappIDL as Myfirstsolapp, provider)
}

// This is a helper function to get the program ID for the Myfirstsolapp program depending on the cluster.
export function getMyfirstsolappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Myfirstsolapp program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return MYFIRSTSOLAPP_PROGRAM_ID
  }
}
