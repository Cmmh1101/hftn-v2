import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavLink } from "./NavLink";

const meta: Meta<typeof NavLink> = {
  title: "UI/NavLink",
  component: NavLink,
  parameters: { nextjs: { appDirectory: true } },
};
export default meta;
type Story = StoryObj<typeof NavLink>;

export const HeaderNav: Story = {
  render: () => (
    <nav style={{ display: "flex", gap: 22 }}>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/programs">Programs</NavLink>
      <NavLink href="/impact">Impact</NavLink>
      <NavLink href="/events">Events</NavLink>
    </nav>
  ),
};
