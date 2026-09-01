import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

const meta: Meta<typeof PhotoPlaceholder> = {
  title: "UI/PhotoPlaceholder",
  component: PhotoPlaceholder,
  decorators: [(Story) => <div style={{ width: 240 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof PhotoPlaceholder>;

export const Neutral: Story = { args: { label: "PHOTO — Daniela", aspect: "4/3" } };
export const Warm: Story = { args: { tone: "warm", label: "PHOTO\nvolunteers at a jornada", aspect: "5/4" } };
export const Dark: Story = { args: { tone: "dark", label: "PHOTO\nSchool of Hope student", aspect: "16/10" } };
export const Square: Story = { args: { aspect: "1", label: "Venezuela" } };
