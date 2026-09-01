import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge, type BadgeStatus } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
};
export default meta;
type Story = StoryObj<typeof Badge>;

const statuses: BadgeStatus[] = ["Active", "Published", "Planned", "Completed", "Draft"];

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 10 }}>
      {statuses.map((s) => (
        <Badge key={s} status={s}>{s}</Badge>
      ))}
    </div>
  ),
};
