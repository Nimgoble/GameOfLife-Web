import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';        
import BoardPlayback from '../pages/BoardPlayback';
import * as api from '../api/client';

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

vi.mock('../api/client', async () => {
  const actual = await vi.importActual<typeof api>('../api/client');
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
    expect(screen.getAllByText(/Size:/)[0]).toBeInTheDocument();
  });

  it('advances generation on Forward click', async () => {
    await act(async () => {
      render(<BoardPlayback id='test' />);
    });
    const forwardBtn = screen.getAllByText(/Forward/)[0];
    // Check for generation 0 inside an h3
    expect(screen.getAllByText(/Current state/)[0]).toHaveTextContent('0');
    
    await act(async () => {
      fireEvent.click(forwardBtn);
    });
    
    expect(screen.getAllByText(/Current state/)[0]).toHaveTextContent('1');
  });
});
