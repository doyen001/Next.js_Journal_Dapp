'use client'

import {getMyfirstsolappProgram, getMyfirstsolappProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useMyfirstsolappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getMyfirstsolappProgramId(cluster.network as Cluster), [cluster])
  const program = getMyfirstsolappProgram(provider)

  const accounts = useQuery({
    queryKey: ['myfirstsolapp', 'all', { cluster }],
    queryFn: () => program.account.myfirstsolapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['myfirstsolapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ myfirstsolapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useMyfirstsolappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useMyfirstsolappProgram()

  const accountQuery = useQuery({
    queryKey: ['myfirstsolapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.myfirstsolapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['myfirstsolapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ myfirstsolapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['myfirstsolapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ myfirstsolapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['myfirstsolapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ myfirstsolapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['myfirstsolapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ myfirstsolapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
