// src/hooks/useJupiter.js
import { useState, useEffect } from 'react'

const REGISTRY_URL =
  'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json'
const JUP_V6_URL = 'https://token.jup.ag/all'

export default function useJupiter() {
  const [tokens, setTokens]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        // 1) Fetch the on-chain Solana token registry
        const regRes = await fetch(REGISTRY_URL)
        if (!regRes.ok) throw new Error('Failed to load Solana registry')
        const { tokens: registryTokens } = await regRes.json()
        const nativeSet = new Set(
          registryTokens.map(t => t.address.toLowerCase())
        )

        // 2) Fetch Jupiter V6 token list
        const jupRes = await fetch(JUP_V6_URL)
        if (!jupRes.ok) throw new Error('Failed to load Jupiter data')
        const jupList = await jupRes.json() // array of tokens

        // 3) Keep only native Solana tokens
        const filtered = jupList.filter(tok =>
          nativeSet.has(tok.address.toLowerCase())
        )

        if (!cancelled) setTokens(filtered)
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return { tokens, loading, error }
} 