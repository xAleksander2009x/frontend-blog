import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Article } from "../../../services/api/schemas/article.schema";
import BlogSection from "./BlogSection";

const mockArticles: Article[] = [
  {
    id: "5e1f0a2b-0003-4000-8000-000000000003",
    title: "Testing React Applications with Vitest and Playwright",
    content: "End-to-end and component testing strategies.",
    publishedAt: "2026-08-15T12:00:00.000Z",
  },
  {
    id: "5e1f0a2b-0002-4000-8000-000000000002",
    title: "Validating API Contracts at Runtime with Zod",
    content: "Why runtime schema validation protects UI components.",
    publishedAt: "2026-08-10T09:30:00.000Z",
  },
  {
    id: "5e1f0a2b-0001-4000-8000-000000000001",
    title: "Getting Started with NestJS and CQRS",
    content: "Building clean modular backend APIs.",
    publishedAt: "2026-08-01T10:00:00.000Z",
  },
];

const meta: Meta<typeof BlogSection> = {
  title: "AboutMe/BlogSection",
  component: BlogSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BlogSection>;

export const DefaultWithArticles: Story = {
  args: {
    loader: async () => mockArticles,
  },
};

export const LoadingState: Story = {
  args: {
    loader: () => new Promise<Article[]>(() => {}),
  },
};

export const EmptyState: Story = {
  args: {
    loader: async () => [],
  },
};

export const ErrorState: Story = {
  args: {
    loader: async () => {
      throw new Error("Simulated API failure");
    },
  },
};

export const VeryLongTitleWrapping: Story = {
  args: {
    loader: async () => [
      {
        id: "5e1f0a2b-0004-4000-8000-000000000004",
        title:
          "SupercalifragilisticexpialidociousArchitectureGuideForModernFullStackTypeScriptApplicationsWithoutHorizontalOverflow",
        content: "Verifies that long unbroken titles wrap cleanly.",
        publishedAt: "2026-08-20T08:00:00.000Z",
      },
    ],
  },
};
