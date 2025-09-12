import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import TabNavigation from '../TabNavigation';

describe('TabNavigation', () => {
  const mockOnTabChange = jest.fn();

  beforeEach(() => {
    mockOnTabChange.mockClear();
  });

  it('renders without crashing', () => {
    render(<TabNavigation activeTab="all-offers" onTabChange={mockOnTabChange} />);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <TabNavigation activeTab="all-offers" onTabChange={mockOnTabChange} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with different active tab', async () => {
    const { container } = render(
      <TabNavigation activeTab="my-cargo" onTabChange={mockOnTabChange} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});