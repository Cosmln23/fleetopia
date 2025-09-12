import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SearchBar from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onChange: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'Caută după destinație, tip cargo sau companie...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'București România',
    placeholder: 'Caută după destinație, tip cargo sau companie...',
  },
};

export const CustomPlaceholder: Story = {
  args: {
    value: '',
    placeholder: 'Search for destinations...',
  },
};