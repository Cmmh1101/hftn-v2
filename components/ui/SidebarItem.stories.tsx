import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarItem } from "./SidebarItem";

const meta: Meta<typeof SidebarItem> = {
  title: "UI/SidebarItem",
  component: SidebarItem,
};
export default meta;
type Story = StoryObj<typeof SidebarItem>;

export const Sidebar: Story = {
  render: () => (
    <div
      style={{
        background: "#011332",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: 220,
      }}
    >
      <SidebarItem href="/admin">Overview</SidebarItem>
      <SidebarItem href="/admin/programs">Programs & Jornadas</SidebarItem>
      <SidebarItem href="/admin/events">Events & Fundraising</SidebarItem>
    </div>
  ),
};
