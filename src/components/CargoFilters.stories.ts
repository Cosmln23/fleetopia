import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import CargoFilters from './CargoFilters';

const meta: Meta<typeof CargoFilters> = {
  title: 'Components/CargoFilters',
  component: CargoFilters,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onFiltersChange: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filters: {},
  },
};

export const WithFilters: Story = {
  args: {
    filters: {
      country: 'România',
      sortBy: 'Price: Low to High',
      cargoType: 'Refrigerat',
      urgency: 'High',
      minPrice: '100',
      maxPrice: '500',
    },
  },
};

export const PriceFilterOnly: Story = {
  args: {
    filters: {
      minPrice: '200',
      maxPrice: '800',
    },
  },
};