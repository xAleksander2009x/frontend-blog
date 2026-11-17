import { Button, InfoMessage } from "@gi-org-pl/athena";
import { Link } from "react-router";
import { type ArticleByIdLoader, useArticle } from "../../../hooks/useArticle";

export interface ArticleDetailProps {
  articleId: string | undefined;
  loader?: ArticleByIdLoader;
}

const formatPublicationDate = (isoDate: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDate));
};

const splitParagraphs = (content: string): string[] => {
  return content
    .split(/\r?\n\s*\r?\n|\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
};

const ArticleDetail = ({ articleId, loader }: ArticleDetailProps) => {
  const { status, article, errorMessage, retry } = useArticle(
    articleId,
    loader,
  );

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-gi-dark-primary underline-offset-4 hover:underline"
        >
          &larr; Back to About Me
        </Link>
      </nav>

      {status === "loading" && (
        <output
          aria-live="polite"
          className="block rounded-lg border border-gi-dark-ash bg-gi-light-gray p-4 text-sm text-gi-dark-gray"
        >
          Loading article...
        </output>
      )}

      {status === "not-found" && (
        <div className="space-y-4">
          <InfoMessage variant="info">
            This article does not exist or may have been removed.
          </InfoMessage>
          <Link
            to="/"
            className="inline-block text-sm font-medium text-gi-dark-primary underline underline-offset-4"
          >
            Return to About Me
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-3">
          <InfoMessage variant="error">
            {errorMessage ?? "Unable to load this article right now."}
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

      {status === "success" && article && (
        <article className="min-w-0 space-y-6">
          <header className="space-y-2 border-b border-gi-dark-ash pb-4">
            <h1 className="break-words text-3xl font-bold text-gi-dark-primary sm:text-4xl">
              {article.title}
            </h1>
            <time
              dateTime={article.publishedAt}
              className="block text-sm text-gi-dark-gray"
            >
              {formatPublicationDate(article.publishedAt)}
            </time>
          </header>

          <div className="space-y-4 text-base leading-relaxed text-gi-dark-primary">
            {splitParagraphs(article.content).map((paragraph, index) => (
              <p
                key={`${article.id}-paragraph-${index}`}
                className="break-words"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      )}
    </div>
  );
};

export default ArticleDetail;
