import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import CargoCard from '../CargoCard';

describe('CargoCard', () => {
  const mockOnClick = jest.fn();
  const mockCargo = {
    id: 1,
    title: 'Test Cargo',
    route: 'RO, București, 100001 → RO, Cluj-Napoca, 400001',
    type: 'General',
    weight: '1200 kg',
    volume: '15.5 m³',
    price: '€520',
    poster: 'Test Transport SRL',
    verified: true,
    urgency: 'Medium',
    loadingDate: '2025-01-15',
    deliveryDate: '2025-01-17',
    distance: '432 km',
    estimatedTime: '5h 45m'
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders without crashing', () => {
    render(<CargoCard cargo={mockCargo} onClick={mockOnClick} />);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <CargoCard cargo={mockCargo} onClick={mockOnClick} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with different cargo type', async () => {
    const { container } = render(
      <CargoCard 
        cargo={{...mockCargo, type: 'Refrigerat', verified: false}} 
        onClick={mockOnClick} 
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});