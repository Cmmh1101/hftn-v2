import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  args: { children: "Donate" },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: "primary" } };
export const Accent: Story = { args: { variant: "accent" } };
export const AccentOnDark: Story = {
  args: { variant: "accentOnDark", children: "Learn about School of Hope" },
  parameters: { backgrounds: { default: "dark" } },
  render: (args) => (
    <div style={{ background: "#03307c", padding: 24 }}>
      <Button {...args} />
    </div>
  ),
};
export const Outline: Story = { args: { variant: "outline", children: "Give monthly" } };
export const Link: Story = { args: { variant: "link", children: "Our story →" } };
export const Small: Story = { args: { variant: "link", size: "sm", children: "Edit" } };
export const AsLink: Story = { args: { href: "/donate", children: "Donate" } };
