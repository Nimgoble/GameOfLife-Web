import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders without crashing and shows header', () => {
    render(<App />);
    expect(screen.getByText(/Game of Life — Web UI/)).toBeInTheDocument();
  });
  it("should fail, so that we test Renders 'on ci checks pass' build deployment", () => {
    expect(true).toBe(false);
  });
});
