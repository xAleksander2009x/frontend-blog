import { isAxiosError } from "axios";
import { apiClient } from "./client/apiClient";
import {
  type Article,
  articleSchema,
  articlesListSchema,
} from "./schemas/article.schema";

export class ArticleNotFoundError extends Error {
  constructor(articleId: string) {
    super(`Article with id "${articleId}" was not found.`);
    this.name = "ArticleNotFoundError";
  }
}

const articleIdSchema = articleSchema.shape.id;

export const sortArticlesNewestFirst = (articles: Article[]): Article[] => {
  return [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
};

export const fetchArticles = async (
  signal?: AbortSignal,
): Promise<Article[]> => {
  const response = await apiClient.get<unknown>("/api/v1/articles", {
    signal,
  });
  const parsedArticles = articlesListSchema.parse(response.data);
  return sortArticlesNewestFirst(parsedArticles);
};

export const fetchArticleById = async (
  id: string,
  signal?: AbortSignal,
): Promise<Article> => {
  const parsedId = articleIdSchema.safeParse(id);
  if (!parsedId.success) {
    throw new ArticleNotFoundError(id);
  }

  try {
    const response = await apiClient.get<unknown>(
      `/api/v1/articles/${encodeURIComponent(parsedId.data)}`,
      { signal },
    );
    return articleSchema.parse(response.data);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      throw new ArticleNotFoundError(parsedId.data);
    }
    throw error;
  }
};
