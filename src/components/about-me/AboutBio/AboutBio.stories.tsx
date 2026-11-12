import type { Meta, StoryObj } from "@storybook/react-vite";
import AboutBio from "./AboutBio";

const meta: Meta<typeof AboutBio> = {
  title: "AboutMe/AboutBio",
  component: AboutBio,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AboutBio>;

export const Default: Story = {
  args: {
    title: "About Me",
    paragraphs: [
      "Hi! I am Aleksander, a software developer passionate about building clean, accessible, and well-tested web applications.",
      "During my internship, I am developing a full-stack blog platform using NestJS on the back end and React with TypeScript on the front end.",
    ],
    interests: [
      "TypeScript",
      "React",
      "Node.js",
      "Tailwind CSS",
      "Docker",
      "Clean Architecture",
    ],
  },
};

export const WithoutInterests: Story = {
  args: {
    title: "Background",
    paragraphs: ["A simple text-only section without interest badges."],
    interests: [],
  },
};
