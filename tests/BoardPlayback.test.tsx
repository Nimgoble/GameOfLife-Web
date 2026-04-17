import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';        
import BoardPlayback from '../src/pages/BoardPlayback';
import * as api from '../src/api/client';

const mockBoard = {
  id: 'test',
  rows: 2,
  columns: 2,
  createdAt: new Date().toISOString(),
  cells: [
    [true, false],
    [false, true]
  ]
};
const mockFinal = { ...mockBoard };

vi.mock('../src/api/client', async () => {
  const actual = await vi.importActual<typeof api>('../src/api/client');
  return {
    ...actual,
    getBoard: vi.fn(() => Promise.resolve(mockBoard)),
    getFinalState: vi.fn(() => Promise.resolve(mockFinal)),
    getNStates: vi.fn((_url, _id, gen) => Promise.resolve({ ...mockBoard, cells: [
      [!!(gen % 2), false],
      [false, !!(gen % 2)]
    ] }))
  };
});

describe('BoardPlayback', () => {
  it('renders board info and grid', async () => {
    await act(async () => {
      render(<BoardPlayback id='test' />);
    });

    // Check for the board size info by searching the entire document text
    const docText = document.body.textContent || '';
    expect(docText.toLowerCase()).toContain('size');
    expect(docText.replace(/\s+/g, '').toLowerCase()).toContain('size:2x2');

    // Optionally, check that the grid is rendered (2x2)
    const cells = screen.getAllByRole('button');
    expect(cells.length).toBe(4);
  });

  it('advances generation on Forward click', async () => {
    await act(async () => {
      render(<BoardPlayback id='test' />);
    });
    const forwardBtn = screen.getAllByText(/Forward/)[0];
    expect(screen.getAllByText(/Current state/)[0]).toHaveTextContent('0');
    await act(async () => {
      fireEvent.click(forwardBtn);
    });
    expect(screen.getAllByText(/Current state/)[0]).toHaveTextContent('1');
  });
});
