import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import CargoCard from './CargoCard';

const meta: Meta<typeof CargoCard> = {
  title: 'Components/CargoCard',
  component: CargoCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockCargo = {
  id: 1,
  title: 'Produse textile pentru export',
  route: 'RO, București, 100001 → RO, Cluj-Napoca, 400001',
  type: 'General',
  weight: '1200 kg',
  volume: '15.5 m³',
  price: '€520',
  poster: 'Alexandru Transport SRL',
  verified: true,
  urgency: 'Medium',
  loadingDate: '2025-01-15',
  deliveryDate: '2025-01-17',
  distance: '432 km',
  estimatedTime: '5h 45m'
};

export const Default: Story = {
  args: {
    cargo: mockCargo,
  },
};

export const Refrigerated: Story = {
  args: {
    cargo: {
      ...mockCargo,
      id: 2,
      title: 'Produse alimentare refrigerate',
      type: 'Refrigerat',
      weight: '450 kg',
      price: '€210',
      urgency: 'High',
      verified: false,
    },
  },
};

export const Oversized: Story = {
  args: {
    cargo: {
      ...mockCargo,
      id: 3,
      title: 'Echipamente industriale',
      type: 'Oversized',
      weight: '800 kg',
      price: '€430',
      urgency: 'Low',
    },
  },
};