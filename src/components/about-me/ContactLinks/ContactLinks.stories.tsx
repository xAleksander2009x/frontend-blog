import type { Meta, StoryObj } from "@storybook/react-vite";
import ContactLinks from "./ContactLinks";

const meta: Meta<typeof ContactLinks> = {
  title: "AboutMe/ContactLinks",
  component: ContactLinks,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContactLinks>;

export const Default: Story = {
  args: {
    title: "Connect With Me",
    links: [
      { label: "GitHub", href: "https://github.com" },
      { label: "Portfolio", href: "https://example.com" },
    ],
  },
};

export const SingleLink: Story = {
  args: {
    title: "Contact",
    links: [{ label: "GitHub Profile", href: "https://github.com" }],
  },
};
