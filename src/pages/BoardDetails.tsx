import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBoard, BoardStateResponse } from '../api/client'
import BoardGrid from '../components/BoardGrid'

export default function BoardDetails() {
  const { id } = useParams<{ id: string }>()
  const [state, setState] = useState<BoardStateResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const apiUrl = import.meta.env.GOL_API_URL ?? ''

  useEffect(() => {
    if (!id) return
    let cancelled = false;
    (async () => {
      setLoading(true)
      try {
        const s = await getBoard(apiUrl, id)
        if (!cancelled) setState(s)
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? String(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div style={{ marginTop: 16 }}>
      <Link to="/">← Back</Link>
      <h2>Board {id}</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {state && (
        <>
          <div style={{ marginBottom: 16 }}>
            <strong>Size:</strong> {state.rows} x {state.columns}
            <br />
            <strong>Created:</strong> {new Date(state.createdAt).toLocaleString()}
          </div>
          <BoardGrid cells={state.cells} readOnly cellSize={18} gap={2} />
        </>
      )}
    </div>
  )
}
