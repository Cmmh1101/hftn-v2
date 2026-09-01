import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 280 }}>
      <div className="text-sm font-bold">Hope Sports</div>
      <p className="text-[13.5px] text-muted mt-2">
        Team sports and mentorship that keep kids off the streets and build character.
      </p>
    </Card>
  ),
};

export const Highlighted: Story = {
  render: (args) => (
    <Card {...args} highlight style={{ width: 240, textAlign: "center" }}>
      <div className="font-serif text-2xl font-bold">$150</div>
      <div className="text-xs text-muted-2 mt-1.5">One month of School of Hope tuition</div>
    </Card>
  ),
};
