import { describe, it, expect } from 'vitest';
import * as api from '../api/client';

describe('API client', () => {
  it('exports required functions', () => {
    expect(typeof api.getBoard).toBe('function');
    expect(typeof api.getNStates).toBe('function');
    expect(typeof api.getFinalState).toBe('function');
    expect(typeof api.uploadBoard).toBe('function');
    expect(typeof api.listBoards).toBe('function');
  });
});
