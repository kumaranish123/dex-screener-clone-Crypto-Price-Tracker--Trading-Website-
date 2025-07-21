// src/hooks/useWalletBalance.js
import { useState, useEffect } from 'react'
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { AccountLayout } from '@solana/spl-token'

const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed')

export default function useWalletBalance(mintAddress, decimals = 9) {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const provider = window.solana
        if (!provider?.publicKey) {
          setBalance(0)
          return
        }
        const owner = provider.publicKey

        if (mintAddress === 'So11111111111111111111111111111111111111112') {
          // SOL balance
          const lamports = await connection.getBalance(owner, 'confirmed')
          if (!cancelled) setBalance(lamports / LAMPORTS_PER_SOL)
        } else {
          // SPL Token balance
          const resp = await connection.getTokenAccountsByOwner(owner, { mint: new PublicKey(mintAddress) }, 'confirmed')
          if (resp.value.length === 0) {
            if (!cancelled) setBalance(0)
          } else {
            const accInfo = resp.value[0].account.data
            const data    = AccountLayout.decode(accInfo)
            const amount  = Number(data.amount) // raw amount
            if (!cancelled) setBalance(amount / 10 ** decimals)
          }
        }
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [mintAddress, decimals])

  return { balance, loading, error }
} 