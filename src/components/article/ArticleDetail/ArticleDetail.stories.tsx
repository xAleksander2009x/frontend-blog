import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { ArticleNotFoundError } from "../../../services/api/articlesApi";
import type { Article } from "../../../services/api/schemas/article.schema";
import ArticleDetail from "./ArticleDetail";

const sampleArticle: Article = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Designing Safe Client-Side Routing with React Router and Zod",
  content:
    "Client-side navigation allows visitors to move between the personal overview and individual blog articles without triggering a full browser reload.\n\nEach API response is validated at runtime with Zod so malformed payloads never reach the component tree.\n\nAll article body text is rendered safely as plain React text nodes, preventing cross-site scripting even if user-supplied strings contain HTML tags.",
  publishedAt: "2026-08-12T10:00:00.000Z",
};

const meta: Meta<typeof ArticleDetail> = {
  title: "Article/ArticleDetail",
  component: ArticleDetail,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ArticleDetail>;

export const Default: Story = {
  args: {
    articleId: sampleArticle.id,
    loader: async () => sampleArticle,
  },
};

export const Loading: Story = {
  args: {
    articleId: sampleArticle.id,
    loader: () => new Promise<Article>(() => {}),
  },
};

export const HtmlEscapedContent: Story = {
  args: {
    articleId: sampleArticle.id,
    loader: async () => ({
      ...sampleArticle,
      content:
        "<script>alert('XSS')</script>\n\n<b>This bold tag is rendered literally as text, not HTML.</b>",
    }),
  },
};

export const NotFound: Story = {
  args: {
    articleId: "00000000-0000-4000-8000-000000000000",
    loader: async (id: string) => {
      throw new ArticleNotFoundError(id);
    },
  },
};

export const ErrorState: Story = {
  args: {
    articleId: sampleArticle.id,
    loader: async () => {
      throw new Error("Network error");
    },
  },
};
