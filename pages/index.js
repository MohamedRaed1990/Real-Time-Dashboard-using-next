import React, { useEffect, useMemo, useState } from 'react'
import AssetTable from '../components/AssetTable'

function generateMockAssets() {
  const types = ['Stock', 'Crypto', 'ETF']
  const symbols = ['AAPL', 'GOOGL', 'TSLA', 'BTC', 'ETH', 'USO', 'VOO', 'MSFT', 'AMZN', 'SOL']
  return symbols.map((s, i) => ({
    id: i + 1,
    symbol: s,
    name: `${s} Inc.`,
    type: types[i % types.length],
    price: Math.random() * (i < 4 ? 1500 : 500),
    change: (Math.random() - 0.5) * 5,
    allocation: Math.round(Math.random() * 30)
  }))
}

export default function Home() {
  const [assets, setAssets] = useState([])
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [sortBy, setSortBy] = useState('allocation')
  const [sortDir, setSortDir] = useState('desc')

  
  useEffect(() => {
    setAssets(generateMockAssets())
  }, [])
 
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    const id = setInterval(() => {
      setAssets((prev) => {
        const copy = prev.map((a) => ({ ...a }))
        const updates = 1 + Math.floor(Math.random() * 3)
        for (let i = 0; i < updates; i++) {
          const idx = Math.floor(Math.random() * copy.length)
          const deltaPct = (Math.random() - 0.5) * 0.02 // small change
          copy[idx].price = Math.max(0.01, copy[idx].price * (1 + deltaPct))
          copy[idx].change = deltaPct * 100
        }
        return copy
      })
    }, 2000)
    return () => clearInterval(id)
  }, [])

  const onSort = (key) => {
    if (sortBy === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortBy(key)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    let list = assets.slice()
    if (typeFilter !== 'All') list = list.filter((a) => a.type === typeFilter)
    if (debounced) {
      const q = debounced.toLowerCase()
      list = list.filter((a) => a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q))
    }
    list.sort((a, b) => {
      const av = a[sortBy]
      const bv = b[sortBy]
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortDir === 'asc' ? av - bv : bv - av
    })
    return list
  }, [assets, debounced, typeFilter, sortBy, sortDir])

  const types = ['All', 'Stock', 'Crypto', 'ETF']

  return (
    <div className="container">
      <header className="header">
        <h1>Real-Time Assets Dashboard</h1>
        <p className="subtitle">Mock portfolio with client-side filtering, sorting & debounced search</p>
      </header>

      <section className="controls">
        <div className="control-row">
          <input
            aria-label="Search assets"
            placeholder="Search by symbol or name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search"
          />

          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="select">
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="meta">
          <div>Showing {filtered.length} assets</div>
          <div>Sort: {sortBy} ({sortDir})</div>
        </div>
      </section>

      <main>
        <AssetTable assets={filtered} onSort={onSort} sortBy={sortBy} sortDir={sortDir} />
      </main>

      <footer className="foot">Data is mocked and updates every 2s (client-side)</footer>
    </div>
  )
}
