import { apiClient } from "./client/apiClient";
import { type Article, articlesListSchema } from "./schemas/article.schema";

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
