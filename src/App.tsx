import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { listBoards, BoardSummaryResponse } from './api/client'
import BoardDetails from './pages/BoardDetails'
import NewBoard from './pages/NewBoard'

export default function App() {
  const apiUrl = import.meta.env.GOL_API_URL ?? ''
  const [message, setMessage] = useState('')
  const [boards, setBoards] = useState<BoardSummaryResponse[]>([])

  useEffect(() => {
    if (!apiUrl) setMessage('GOL_API_URL not set — set this to your API base URL')
  }, [apiUrl])

  useEffect(() => {
    if (!apiUrl) return
    let cancelled = false
    ;(async () => {
      try {
        const list = await listBoards(apiUrl)
        if (!cancelled) setBoards(list)
      } catch (err: any) {
        if (!cancelled) setMessage(err?.message ?? String(err))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [apiUrl])

  return (
    <BrowserRouter>
      <div style={{ padding: 24 }}>
        <h1>Game of Life — Web UI (Demo)</h1>
        <p>{message}</p>
        <Link to="/new" style={{ marginLeft: 0, display: 'inline-block', marginTop: 12 }}>
          Create new board
        </Link>

        <Routes>
          <Route
            path="/"
            element={
              <div style={{ marginTop: 16 }}>
                <h2>Existing Boards</h2>
                {boards.length === 0 && <p>No boards found.</p>}
                <ul>
                  {boards.map((b) => (
                    <li key={b.id} style={{ marginBottom: 8 }}>
                      <Link to={`/boards/${b.id}`}>
                        {b.id} — {b.rows}x{b.columns} — {new Date(b.createdAt).toLocaleString()}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
          <Route path="/new" element={<NewBoard />} />
          <Route path="/boards/:id" element={<BoardDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

