import { useCallback, useEffect, useState } from "react";
import { fetchArticles } from "../services/api/articlesApi";
import type { Article } from "../services/api/schemas/article.schema";

export type ArticlesStatus = "loading" | "success" | "empty" | "error";

export interface UseArticlesResult {
  status: ArticlesStatus;
  articles: Article[];
  errorMessage: string | null;
  retry: () => void;
}

export const useArticles = (
  loader: (signal?: AbortSignal) => Promise<Article[]> = fetchArticles,
): UseArticlesResult => {
  const [status, setStatus] = useState<ArticlesStatus>("loading");
  const [articles, setArticles] = useState<Article[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setAttempt((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    setStatus("loading");
    setErrorMessage(null);

    loader(controller.signal)
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setArticles(data);
        setStatus(data.length === 0 ? "empty" : "success");
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }
        setArticles([]);
        setErrorMessage("Unable to load articles right now. Please try again.");
        setStatus("error");
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [loader, attempt]);

  return { status, articles, errorMessage, retry };
};
