// src/hooks/usePumpFun.js
import { useState } from 'react'

// Stubbed Pump.fun hook – always “done” with no data
export default function usePumpFun() {
  const [data]    = useState([])    // no pools
  const [loading] = useState(false) // not loading
  const [error]   = useState(null)
  function getTrendingPools(n = 10) {
    return []
  }
  return { data, loading, error, getTrendingPools }
}
