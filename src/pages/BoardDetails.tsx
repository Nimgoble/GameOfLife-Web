import React from 'react'
import { useParams, Link } from 'react-router-dom'
import BoardPlayback from './BoardPlayback'

export default function BoardDetails() {
  const { id } = useParams<{ id: string }>()
  return (
    <div style={{ marginTop: 16 }}>
      <Link to="/">← Back to list</Link>
      <h2>Board {id}</h2>
      {id && <BoardPlayback id={id} />}
    </div>
  )
}
