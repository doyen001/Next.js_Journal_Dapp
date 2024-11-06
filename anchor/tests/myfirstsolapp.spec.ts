import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Myfirstsolapp} from '../target/types/myfirstsolapp'

describe('myfirstsolapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Myfirstsolapp as Program<Myfirstsolapp>

  const myfirstsolappKeypair = Keypair.generate()

  it('Initialize Myfirstsolapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        myfirstsolapp: myfirstsolappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([myfirstsolappKeypair])
      .rpc()

    const currentCount = await program.account.myfirstsolapp.fetch(myfirstsolappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Myfirstsolapp', async () => {
    await program.methods.increment().accounts({ myfirstsolapp: myfirstsolappKeypair.publicKey }).rpc()

    const currentCount = await program.account.myfirstsolapp.fetch(myfirstsolappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Myfirstsolapp Again', async () => {
    await program.methods.increment().accounts({ myfirstsolapp: myfirstsolappKeypair.publicKey }).rpc()

    const currentCount = await program.account.myfirstsolapp.fetch(myfirstsolappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Myfirstsolapp', async () => {
    await program.methods.decrement().accounts({ myfirstsolapp: myfirstsolappKeypair.publicKey }).rpc()

    const currentCount = await program.account.myfirstsolapp.fetch(myfirstsolappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set myfirstsolapp value', async () => {
    await program.methods.set(42).accounts({ myfirstsolapp: myfirstsolappKeypair.publicKey }).rpc()

    const currentCount = await program.account.myfirstsolapp.fetch(myfirstsolappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the myfirstsolapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        myfirstsolapp: myfirstsolappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.myfirstsolapp.fetchNullable(myfirstsolappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
