import { Button, InfoMessage } from "@gi-org-pl/athena";
import { Link } from "react-router";
import { useArticles } from "../../../hooks/useArticles";
import type { Article } from "../../../services/api/schemas/article.schema";

export interface BlogSectionProps {
  title?: string;
  loader?: (signal?: AbortSignal) => Promise<Article[]>;
}

const formatPublicationDate = (isoDate: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDate));
};

const BlogSection = ({ title = "Articles", loader }: BlogSectionProps) => {
  const { status, articles, errorMessage, retry } = useArticles(loader);

  return (
    <section
      aria-labelledby="blog-section-heading"
      className="space-y-4 border-t border-gi-dark-ash pt-6"
    >
      <h2
        id="blog-section-heading"
        className="text-2xl font-semibold text-gi-dark-primary"
      >
        {title}
      </h2>

      {status === "loading" && (
        <output
          aria-live="polite"
          className="block rounded-lg border border-gi-dark-ash bg-gi-light-gray p-4 text-sm text-gi-dark-gray"
        >
          Loading articles...
        </output>
      )}

      {status === "error" && (
        <div className="space-y-3">
          <InfoMessage variant="error">
            {errorMessage ?? "Unable to load articles right now."}
          </InfoMessage>
          <Button
            type="outlined"
            variant="primary"
            size="small"
            onClick={retry}
          >
            Try again
          </Button>
        </div>
      )}

      {status === "empty" && (
        <InfoMessage variant="info">No articles published yet.</InfoMessage>
      )}

      {status === "success" && (
        <ul className="space-y-3">
          {articles.map((article) => (
            <li
              key={article.id}
              className="min-w-0 rounded-lg border border-gi-dark-ash bg-gi-light-gray transition-colors hover:border-gi-dark-primary"
            >
              <article className="min-w-0">
                <Link
                  to={`/articles/${article.id}`}
                  className="block space-y-1 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gi-dark-primary"
                >
                  <h3 className="break-words text-lg font-semibold text-gi-dark-primary underline-offset-4 hover:underline">
                    {article.title}
                  </h3>
                  <time
                    dateTime={article.publishedAt}
                    className="block text-sm text-gi-dark-gray"
                  >
                    {formatPublicationDate(article.publishedAt)}
                  </time>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BlogSection;
