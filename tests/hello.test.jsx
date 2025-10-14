import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/App';

// Custom render function that includes router context
const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('App Component', () => {
  it('renders header with brand name', () => {
    renderWithRouter(<App />);
    expect(screen.getByRole('link', { name: /Crag Global/i })).toBeInTheDocument();
  });

  it('renders main navigation', () => {
    renderWithRouter(<App />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('renders services section', () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/Our Products & Solutions/i)).toBeInTheDocument();
  });
});