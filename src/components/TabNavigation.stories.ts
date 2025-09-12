import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import TabNavigation from './TabNavigation';

const meta: Meta<typeof TabNavigation> = {
  title: 'Components/TabNavigation',
  component: TabNavigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    activeTab: {
      control: { type: 'select' },
      options: ['all-offers', 'my-cargo', 'my-quotes', 'active-deals'],
    },
  },
  args: { onTabChange: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activeTab: 'all-offers',
  },
};

export const MyCargoActive: Story = {
  args: {
    activeTab: 'my-cargo',
  },
};

export const MyQuotesActive: Story = {
  args: {
    activeTab: 'my-quotes',
  },
};

export const ActiveDealsActive: Story = {
  args: {
    activeTab: 'active-deals',
  },
};