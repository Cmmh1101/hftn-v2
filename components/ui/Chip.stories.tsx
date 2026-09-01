import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Chip } from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "UI/Chip",
  component: Chip,
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const RegionFilter: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 10 }}>
      <Chip href="?region=all" selected>All Regions</Chip>
      <Chip href="?region=sa" selected={false}>South America</Chip>
      <Chip href="?region=ca" selected={false}>Central America</Chip>
    </div>
  ),
};
