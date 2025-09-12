import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders without crashing', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <SearchBar value="" onChange={mockOnChange} placeholder="Search..." />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with value', async () => {
    const { container } = render(
      <SearchBar value="test search" onChange={mockOnChange} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});