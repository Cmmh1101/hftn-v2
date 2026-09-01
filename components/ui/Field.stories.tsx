import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input, Textarea } from "./Field";

const meta: Meta<typeof Input> = {
  title: "UI/Field",
  component: Input,
};
export default meta;
type Story = StoryObj<typeof Input>;

export const TextInput: Story = { args: { placeholder: "Full name" } };
export const SearchInput: Story = {
  args: { placeholder: "Search programs, donors, posts...", style: { width: 320 } },
};
export const TextareaField: Story = {
  render: () => <Textarea placeholder="Message" rows={5} style={{ width: 320 }} />,
};
