import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { getBoard, getNStates, getFinalState, BoardStateResponse } from '../api/client'
import BoardGrid from '../components/BoardGrid'

interface BoardPlaybackProps {
  id: string
}


const CurrentBoardGrid = React.memo(function CurrentBoardGrid({ cells, width, height }: { cells: boolean[][], width: number, height: number }) {
  return (
    <div style={{ width, height, overflow: 'hidden', display: 'flex', /*alignItems: 'center',*/ justifyContent: 'center', background: '#f8f8f8', border: '1px solid #ccc', transition: 'none' }}>
      <BoardGrid cells={cells} readOnly cellSize={18} gap={2} />
    </div>
  )
})

export default function BoardPlayback({ id }: BoardPlaybackProps) {
  const [states, setStates] = useState<BoardStateResponse[]>([])
  const [finalState, setFinalState] = useState<BoardStateResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [finalLoading, setFinalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generation, setGeneration] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [fetching, setFetching] = useState(false)
  const apiUrl = import.meta.env.GOL_API_URL ?? ''
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastFetchTimeRef = useRef<number>(0)

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true)
      try {
        const s = await getBoard(apiUrl, id)
        if (!cancelled) {
          setStates([s])
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? String(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, apiUrl])

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setFinalLoading(true)
      try {
        const final = await getFinalState(apiUrl, id)
        if (!cancelled) setFinalState(final)
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? String(err))
      } finally {
        if (!cancelled) setFinalLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, apiUrl])

  const fetchState = useCallback(async (gen: number) => {
    setFetching(true)
    lastFetchTimeRef.current = Date.now();
    try {
      if (states[gen]) {
        setFetching(false)
        return
      }
      const s = await getNStates(apiUrl, id, gen)
      setStates(prev => {
        const next = [...prev]
        next[gen] = s
        return next
      })
    } catch (err: any) {
      setError(err?.message ?? String(err))
    } finally {
      setFetching(false)
    }
  }, [id, apiUrl, states])

  const handleForward = useCallback(() => {
    const nextGen = generation + 1
    setGeneration(nextGen)
    fetchState(nextGen)
  }, [generation, fetchState])

  const handleBack = useCallback(() => {
    if (generation > 0) {
      const prevGen = generation - 1
      setGeneration(prevGen)
      fetchState(prevGen)
    }
  }, [generation, fetchState])

  const handlePlay = useCallback(() => {
    setPlaying(true)
  }, [])

  const handleStop = useCallback(() => {
    setPlaying(false)
    if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current)
  }, [])

  useEffect(() => {
    if (!playing) return

    let cancelled = false

    const scheduleNextFetch = () => {
      if (cancelled) return
      const now = Date.now()
      const timeSinceLastFetch = now - lastFetchTimeRef.current
      const delayUntilNextFetch = Math.max(0, 500 - timeSinceLastFetch)

      playTimeoutRef.current = setTimeout(async () => {
        if (cancelled) return
        const nextGen = generation + 1
        setGeneration(nextGen)
        await fetchState(nextGen)
        scheduleNextFetch()
      }, delayUntilNextFetch)
    }

    scheduleNextFetch()

    return () => {
      cancelled = true
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current)
    }
  }, [playing, generation, fetchState])


  // Memoize initial board size for fixed grid dimensions
  // Always use a fixed size for the grid container
  const cellSize = 18
  const gap = 2
  // Use board size if loaded, otherwise fallback to 10x10
  const initialRows = useMemo(() => states[0]?.rows || 10, [states])
  const initialCols = useMemo(() => states[0]?.columns || 10, [states])
  const gridWidth = initialCols * cellSize + gap * (initialCols - 1) + gap * 2
  const gridHeight = initialRows * cellSize + gap * (initialRows - 1) + gap * 2
  // Always provide a grid of the correct shape
  const currentCells = useMemo(() => {
    if (states.length > 0 && states[generation]) {
      return states[generation].cells
    }
    return Array.from({ length: initialRows }, () => Array(initialCols).fill(false))
  }, [states, generation, initialRows, initialCols])

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <>
        {/* Info and controls only update if board is loaded, but grid container is always present */}
        {states.length > 0 && states[0] && (
          <div style={{ marginBottom: 16 }}>
            <strong>Size:</strong> {states[0].rows} x {states[0].columns}
            <br />
            <strong>Created:</strong> {new Date(states[0].createdAt).toLocaleString()}
            <br />
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={handleBack}
            disabled={generation === 0 || playing}
            style={{ padding: '8px 16px', marginRight: 8, cursor: generation === 0 || playing ? 'default' : 'pointer' }}
          >
            ← Back
          </button>
          <button
            onClick={handlePlay}
            disabled={playing}
            style={{ padding: '8px 16px', marginRight: 8, cursor: playing ? 'default' : 'pointer' }}
          >
            ▶ Play
          </button>
          <button
            onClick={handleStop}
            disabled={!playing}
            style={{ padding: '8px 16px', marginRight: 8, cursor: !playing ? 'default' : 'pointer' }}
          >
            ⏹ Stop
          </button>
          <button
            onClick={handleForward}
            disabled={playing || fetching}
            style={{ padding: '8px 16px', cursor: playing || fetching ? 'default' : 'pointer' }}
          >
            Forward →
          </button>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px' }}>
            <h3>Current state (<strong>Generation:</strong> {generation})</h3>
            <CurrentBoardGrid cells={currentCells} width={gridWidth} height={gridHeight} />
          </div>
          <div style={{ flex: '1 1 320px' }}>
            <h3>Final state</h3>
            {finalState ? (
              <BoardGrid cells={finalState.cells} readOnly cellSize={18} gap={2} />
            ) : finalLoading ? (
              <p>Loading final state...</p>
            ) : (
              <p>Final state not available.</p>
            )}
          </div>
        </div>
      </>
    </>
  )
}