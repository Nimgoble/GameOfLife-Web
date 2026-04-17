import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Basic smoke test for App

describe('App', () => {
  it('renders without crashing and shows header', () => {
    render(<App />);
    expect(screen.getByText(/Game of Life — Web UI/)).toBeInTheDocument();
  });
});
