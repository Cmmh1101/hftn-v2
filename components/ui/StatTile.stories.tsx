import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatTile } from "./StatTile";

const meta: Meta<typeof StatTile> = {
  title: "UI/StatTile",
  component: StatTile,
};
export default meta;
type Story = StoryObj<typeof StatTile>;

export const HomeStat: Story = {
  args: { value: "312", label: "Jornadas completed", size: "lg", tone: "accent" },
};

export const AdminKpiCard: Story = {
  args: {
    value: "$48,200",
    label: "Donations (MTD)",
    variant: "card",
    trend: "↑ 12% vs last month",
    trendTone: "up",
  },
};

export const AdminKpiCardNeutral: Story = {
  args: { value: "6", label: "Active Jornadas", variant: "card", trend: "Across 4 regions" },
};
