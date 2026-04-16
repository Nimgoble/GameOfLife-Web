import React from 'react'

export interface BoardGridProps {
  cells: boolean[][]
  readOnly?: boolean
  onToggle?: (rowIndex: number, colIndex: number) => void
  cellSize?: number
  gap?: number
}

export default function BoardGrid({
  cells,
  readOnly = false,
  onToggle,
  cellSize = 20,
  gap = 2
}: BoardGridProps) {
  const columns = cells[0]?.length ?? 0

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
        gap,
        maxHeight: '520px',
        overflow: 'auto',
        border: '1px solid #ccc',
        padding: gap,
        background: '#f8f8f8',
        width: columns * cellSize + gap * (columns - 1) + gap * 2
      }}
    >
      {cells.flatMap((row, rowIndex) =>
        row.map((alive, colIndex) => {
          const commonStyle: React.CSSProperties = {
            width: cellSize,
            height: cellSize,
            background: alive ? '#111' : '#fff',
            border: '1px solid #999',
            padding: 0,
            cursor: readOnly ? 'default' : 'pointer'
          }

          if (readOnly || !onToggle) {
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={commonStyle}
                title={`Row ${rowIndex + 1}, Column ${colIndex + 1}: ${alive ? 'alive' : 'dead'}`}
              />
            )
          }

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              onClick={() => onToggle(rowIndex, colIndex)}
              style={commonStyle}
              aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}: ${alive ? 'alive' : 'dead'}`}
            />
          )
        })
      )}
    </div>
  )
}
