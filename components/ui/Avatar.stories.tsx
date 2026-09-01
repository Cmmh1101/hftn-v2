import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  args: { initials: "MA" },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};
