import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { uploadBoard } from '../api/client'
import BoardGrid from '../components/BoardGrid'

const MIN_DIMENSION = 1
const MAX_DIMENSION = 50

function createEmptyCells(rows: number, columns: number) {
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => false))
}

function createRandomCells(rows: number, columns: number) {
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => Math.random() < 0.5))
}

function resizeCells(cells: boolean[][], rows: number, columns: number) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: columns }, (_, c) => cells[r]?.[c] ?? false)
  )
}

export default function NewBoard() {
  const navigate = useNavigate()
  const apiUrl = import.meta.env.GOL_API_URL ?? ''
  const [rows, setRows] = useState(5)
  const [columns, setColumns] = useState(5)
  const [cells, setCells] = useState<boolean[][]>(() => createEmptyCells(5, 5))
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    if (!apiUrl) return 'GOL_API_URL is not configured.'
    if (!Number.isInteger(rows) || rows < MIN_DIMENSION || rows > MAX_DIMENSION) {
      return `Rows must be an integer between ${MIN_DIMENSION} and ${MAX_DIMENSION}.`
    }
    if (!Number.isInteger(columns) || columns < MIN_DIMENSION || columns > MAX_DIMENSION) {
      return `Columns must be an integer between ${MIN_DIMENSION} and ${MAX_DIMENSION}.`
    }
    return null
  }

  function updateRows(value: number) {
    if (Number.isNaN(value)) return
    const nextRows = Math.max(MIN_DIMENSION, Math.min(MAX_DIMENSION, value))
    setRows(nextRows)
    setCells((prev) => resizeCells(prev, nextRows, columns))
  }

  function updateColumns(value: number) {
    if (Number.isNaN(value)) return
    const nextColumns = Math.max(MIN_DIMENSION, Math.min(MAX_DIMENSION, value))
    setColumns(nextColumns)
    setCells((prev) => resizeCells(prev, rows, nextColumns))
  }

  function toggleCell(rowIndex: number, colIndex: number) {
    setCells((prev) => {
      const next = prev.map((row) => row.slice())
      next[rowIndex][colIndex] = !next[rowIndex][colIndex]
      return next
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const validation = validate()
    if (validation) {
      setError(validation)
      return
    }

    setSubmitting(true)
    try {
      const result = await uploadBoard(apiUrl, cells)
      navigate(`/boards/${result.id}`)
    } catch (err: any) {
      setError(err?.message ?? String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Create New Board</h2>
      <Link to="/" style={{ marginBottom: 16, display: 'inline-block' }}>← Back</Link>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          <div style={{ minWidth: 140 }}>
            <label htmlFor="rows" style={{ display: 'block', marginBottom: 4 }}>
              Rows
            </label>
            <input
              id="rows"
              type="number"
              min={MIN_DIMENSION}
              max={MAX_DIMENSION}
              value={rows}
              onChange={(event) => updateRows(Number(event.target.value))}
              style={{ width: '100%', padding: 8 }}
            />
          </div>

          <div style={{ minWidth: 140 }}>
            <label htmlFor="columns" style={{ display: 'block', marginBottom: 4 }}>
              Columns
            </label>
            <input
              id="columns"
              type="number"
              min={MIN_DIMENSION}
              max={MAX_DIMENSION}
              value={columns}
              onChange={(event) => updateColumns(Number(event.target.value))}
              style={{ width: '100%', padding: 8 }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8 }}>
            <button
              type="button"
              onClick={() => setCells(createRandomCells(rows, columns))}
              style={{ padding: '8px 16px' }}
            >
              Fill randomly
            </button>
            <button
              type="button"
              onClick={() => setCells(createEmptyCells(rows, columns))}
              style={{ padding: '8px 16px' }}
            >
              Clear grid
            </button>
          </div>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ marginBottom: 16 }}>
          <p>Click cells to toggle alive/dead.</p>
          <BoardGrid cells={cells} onToggle={toggleCell} cellSize={24} gap={4} />
        </div>

        <button type="submit" disabled={submitting} style={{ padding: '8px 16px' }}>
          {submitting ? 'Creating …' : 'Create Board'}
        </button>
      </form>
    </div>
  )
}
