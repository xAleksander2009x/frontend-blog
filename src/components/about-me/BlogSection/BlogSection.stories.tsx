import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import type { Article } from "../../../services/api/schemas/article.schema";
import BlogSection from "./BlogSection";

const mockArticles: Article[] = [
  {
    id: "5e1f0a2b-0002-4000-8000-000000000002",
    title: "Validating API Responses with Zod in React Applications",
    content:
      "Runtime validation prevents unexpected payloads from breaking UI.",
    publishedAt: "2026-08-12T10:00:00.000Z",
  },
  {
    id: "5e1f0a2b-0001-4000-8000-000000000001",
    title: "Building a Full-Stack Blog Platform",
    content: "Connecting React Router and NestJS with clean architecture.",
    publishedAt: "2026-08-01T10:00:00.000Z",
  },
];

const meta: Meta<typeof BlogSection> = {
  title: "AboutMe/BlogSection",
  component: BlogSection,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BlogSection>;

export const Default: Story = {
  args: {
    loader: async () => mockArticles,
  },
};

export const Loading: Story = {
  args: {
    loader: () => new Promise<Article[]>(() => {}),
  },
};

export const Empty: Story = {
  args: {
    loader: async () => [],
  },
};

export const ErrorState: Story = {
  args: {
    loader: async () => {
      throw new Error("Failed to fetch articles");
    },
  },
};

export const LongTitle: Story = {
  args: {
    loader: async () => [
      {
        id: "5e1f0a2b-0003-4000-8000-000000000003",
        title:
          "An Extremely Long Article Title That Demonstrates Proper Word Wrapping Without Causing Horizontal Overflow On Mobile Devices",
        content: "Content body",
        publishedAt: "2026-08-15T10:00:00.000Z",
      },
    ],
  },
};
