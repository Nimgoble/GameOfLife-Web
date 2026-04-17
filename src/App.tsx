import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom'
import { listBoards, BoardSummaryResponse } from './api/client'
import BoardDetails from './pages/BoardDetails'
import NewBoard from './pages/NewBoard'

// Memoized layout to prevent unnecessary rerenders of routed pages
const Layout = React.memo(function Layout({ message }: { message: string }) {
  return (
    <div style={{ padding: 24 }}>
      <h1>Game of Life — Web UI (Demo)</h1>
      <p>{message}</p>
      <Link to="/new" style={{ marginLeft: 0, display: 'inline-block', marginTop: 12 }}>
        Create new board
      </Link>
      <div style={{ marginTop: 16 }}>
        <Outlet />
      </div>
    </div>
  )
})

function BoardListPage() {
  const apiUrl = import.meta.env.GOL_API_URL ?? ''
  const [boards, setBoards] = useState<BoardSummaryResponse[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!apiUrl) return
    let cancelled = false
    setLoading(true)
    ;(async () => {
      try {
        const list = await listBoards(apiUrl)
        if (!cancelled) setBoards(list)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [apiUrl])
  return (
    <>
      <h2>Existing Boards</h2>
      {loading && <p>Loading...</p>}
      {boards.length === 0 && !loading && <p>No boards found.</p>}
      <ul>
        {boards.map((b) => (
          <li key={b.id} style={{ marginBottom: 8 }}>
            <Link to={`/boards/${b.id}`}>
              {b.id} — {b.rows}x{b.columns} — {new Date(b.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function App() {
  const apiUrl = import.meta.env.GOL_API_URL ?? ''
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (!apiUrl) setMessage('GOL_API_URL not set — set this to your API base URL')
  }, [apiUrl])
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout message={message} />}>
          <Route path="/" element={<BoardListPage />} />
          <Route path="/new" element={<NewBoard />} />
          <Route path="/boards/:id" element={<BoardDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

