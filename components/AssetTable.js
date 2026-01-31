import React from 'react'

export default function AssetTable({ assets, onSort, sortBy, sortDir }) {
  const header = (key, label) => {
    const active = sortBy === key
    const arrow = active ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''
    return (
      <button onClick={() => onSort(key)} className="th-btn">
        {label}{arrow}
      </button>
    )
  }

  return (
    <div className="table-wrap">
      <table className="assets-table">
        <thead>
          <tr>
            <th>{header('symbol', 'Symbol')}</th>
            <th>{header('name', 'Name')}</th>
            <th>{header('type', 'Type')}</th>
            <th className="num">{header('price', 'Price')}</th>
            <th className="num">{header('change', '24h %')}</th>
            <th className="num">{header('allocation', 'Allocation')}</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <tr key={a.id} className="asset-row">
              <td className="mono">{a.symbol}</td>
              <td>{a.name}</td>
              <td>{a.type}</td>
              <td className="num">${a.price.toFixed(2)}</td>
              <td className={`num ${a.change >= 0 ? 'pos' : 'neg'}`}>{a.change.toFixed(2)}%</td>
              <td className="num">{a.allocation}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
