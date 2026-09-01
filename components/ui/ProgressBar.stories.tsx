import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "UI/ProgressBar",
  component: ProgressBar,
  args: { percent: 60 },
  decorators: [(Story) => <div style={{ width: 240 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const AccentFill: Story = { args: { color: "accent" } };
export const BlueFill: Story = { args: { color: "blue", percent: 78 } };
