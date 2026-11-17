import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { ArticleNotFoundError } from "../../../services/api/articlesApi";
import type { Article } from "../../../services/api/schemas/article.schema";
import ArticleDetail from "./ArticleDetail";

const firstArticle: Article = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "First Full Article",
  content: "First paragraph of the article.\n\nSecond paragraph with details.",
  publishedAt: "2026-08-10T10:00:00.000Z",
};

const secondArticle: Article = {
  id: "22222222-2222-4222-8222-222222222222",
  title: "Second Full Article",
  content: "Completely new article content.",
  publishedAt: "2026-08-14T10:00:00.000Z",
};

describe("<ArticleDetail />", () => {
  it("shows a loading indicator while the article is being fetched", () => {
    // Given
    const pendingLoader = vi.fn(() => new Promise<Article>(() => {}));

    // When
    render(
      <MemoryRouter>
        <ArticleDetail articleId={firstArticle.id} loader={pendingLoader} />
      </MemoryRouter>,
    );

    // Then
    expect(screen.getByText("Loading article...")).toBeInTheDocument();
  });

  it("renders the full article with paragraphs preserved and a link back", async () => {
    // Given
    const loader = vi.fn().mockResolvedValue(firstArticle);

    // When
    render(
      <MemoryRouter>
        <ArticleDetail articleId={firstArticle.id} loader={loader} />
      </MemoryRouter>,
    );

    // Then
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "First Full Article",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("August 10, 2026")).toBeInTheDocument();
    expect(
      screen.getByText("First paragraph of the article."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Second paragraph with details."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Back to About Me/i }),
    ).toHaveAttribute("href", "/");
  });

  it("renders HTML tags in article content as plain text and never executes scripts", async () => {
    // Given
    const xssPayload =
      "<script>window.__xssExecuted = true;</script><b>Bold text</b>";
    const xssArticle: Article = {
      ...firstArticle,
      content: xssPayload,
    };
    const loader = vi.fn().mockResolvedValue(xssArticle);

    // When
    const { container } = render(
      <MemoryRouter>
        <ArticleDetail articleId={xssArticle.id} loader={loader} />
      </MemoryRouter>,
    );

    // Then
    expect(await screen.findByText(xssPayload)).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("b")).toBeNull();
  });

  it("displays a not-found message and a way back when article does not exist or ID is invalid", async () => {
    // Given
    const loader = vi
      .fn()
      .mockRejectedValue(new ArticleNotFoundError("invalid-id"));

    // When
    render(
      <MemoryRouter>
        <ArticleDetail articleId="invalid-id" loader={loader} />
      </MemoryRouter>,
    );

    // Then
    expect(
      await screen.findByText(
        "This article does not exist or may have been removed.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Return to About Me" }),
    ).toHaveAttribute("href", "/");
  });

  it("displays a not-found message when articleId parameter is missing", () => {
    // Given
    const loader = vi.fn();

    // When
    render(
      <MemoryRouter>
        <ArticleDetail articleId={undefined} loader={loader} />
      </MemoryRouter>,
    );

    // Then
    expect(
      screen.getByText("This article does not exist or may have been removed."),
    ).toBeInTheDocument();
    expect(loader).not.toHaveBeenCalled();
  });

  it("shows an error message and retries loading when user clicks Try again", async () => {
    // Given
    const loader = vi
      .fn()
      .mockRejectedValueOnce(new Error("API down"))
      .mockResolvedValueOnce(firstArticle);

    // When
    render(
      <MemoryRouter>
        <ArticleDetail articleId={firstArticle.id} loader={loader} />
      </MemoryRouter>,
    );
    const retryButton = await screen.findByRole("button", {
      name: "Try again",
    });
    expect(
      screen.getByText(
        "Unable to load this article right now. Please try again.",
      ),
    ).toBeInTheDocument();

    fireEvent.click(retryButton);

    // Then
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "First Full Article",
      }),
    ).toBeInTheDocument();
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it("immediately clears the previous article while loading a newly selected article ID", async () => {
    // Given
    let resolveSecond!: (article: Article) => void;
    const loader = vi.fn((id: string) => {
      if (id === firstArticle.id) {
        return Promise.resolve(firstArticle);
      }
      return new Promise<Article>((resolve) => {
        resolveSecond = resolve;
      });
    });

    const { rerender } = render(
      <MemoryRouter>
        <ArticleDetail articleId={firstArticle.id} loader={loader} />
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "First Full Article",
      }),
    ).toBeInTheDocument();

    // When
    rerender(
      <MemoryRouter>
        <ArticleDetail articleId={secondArticle.id} loader={loader} />
      </MemoryRouter>,
    );

    // Then
    expect(screen.queryByText("First Full Article")).not.toBeInTheDocument();
    expect(screen.getByText("Loading article...")).toBeInTheDocument();

    resolveSecond(secondArticle);
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Second Full Article",
      }),
    ).toBeInTheDocument();
  });

  it("aborts in-flight request and ignores late settlements when unmounted early", async () => {
    // Given
    let capturedSignal: AbortSignal | undefined;
    let resolveDelayed!: (article: Article) => void;
    const loader = vi.fn((_id: string, signal?: AbortSignal) => {
      capturedSignal = signal;
      return new Promise<Article>((resolve) => {
        resolveDelayed = resolve;
      });
    });

    // When
    const { unmount } = render(
      <MemoryRouter>
        <ArticleDetail articleId={firstArticle.id} loader={loader} />
      </MemoryRouter>,
    );
    unmount();
    resolveDelayed(firstArticle);
    await Promise.resolve();

    // Then
    expect(capturedSignal?.aborted).toBe(true);
  });
});
