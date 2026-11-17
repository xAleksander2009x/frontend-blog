import { useCallback, useEffect, useState } from "react";
import {
  ArticleNotFoundError,
  fetchArticleById,
} from "../services/api/articlesApi";
import type { Article } from "../services/api/schemas/article.schema";

export type ArticleStatus = "loading" | "success" | "not-found" | "error";

export interface UseArticleResult {
  status: ArticleStatus;
  article: Article | null;
  errorMessage: string | null;
  retry: () => void;
}

export type ArticleByIdLoader = (
  id: string,
  signal?: AbortSignal,
) => Promise<Article>;

export const useArticle = (
  articleId: string | undefined,
  loader: ArticleByIdLoader = fetchArticleById,
): UseArticleResult => {
  const [status, setStatus] = useState<ArticleStatus>("loading");
  const [article, setArticle] = useState<Article | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setAttempt((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!articleId) {
      setArticle(null);
      setErrorMessage(null);
      setStatus("not-found");
      return;
    }

    const controller = new AbortController();
    let isActive = true;

    setArticle(null);
    setErrorMessage(null);
    setStatus("loading");

    loader(articleId, controller.signal)
      .then((loadedArticle) => {
        if (!isActive) {
          return;
        }
        setArticle(loadedArticle);
        setStatus("success");
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }
        setArticle(null);
        if (error instanceof ArticleNotFoundError) {
          setErrorMessage(null);
          setStatus("not-found");
          return;
        }
        setErrorMessage(
          "Unable to load this article right now. Please try again.",
        );
        setStatus("error");
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [articleId, loader, attempt]);

  return { status, article, errorMessage, retry };
};
