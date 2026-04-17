import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BoardGrid from '../src/components/BoardGrid';

const simpleCells = [
  [true, false],
  [false, true]
];

describe('BoardGrid', () => {
  it('renders the correct number of cells', () => {
    const { container } = render(<BoardGrid cells={simpleCells} readOnly />);
    expect(container.querySelectorAll('div[title],button').length).toBe(4);
  });

  it('renders alive and dead cells correctly', () => {
    const { container } = render(<BoardGrid cells={simpleCells} readOnly />);
    const cells = container.querySelectorAll('div[title]');
    expect(cells[0]).toHaveStyle({ background: '#111' }); // alive
    expect(cells[1]).toHaveStyle({ background: '#fff' }); // dead
  });
});
