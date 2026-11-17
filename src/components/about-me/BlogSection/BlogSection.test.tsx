import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Article } from "../../../services/api/schemas/article.schema";
import BlogSection from "./BlogSection";

const sampleArticles: Article[] = [
  {
    id: "5e1f0a2b-0002-4000-8000-000000000002",
    title: "Second Newer Article",
    content: "Detailed second content",
    publishedAt: "2026-08-12T10:00:00.000Z",
  },
  {
    id: "5e1f0a2b-0001-4000-8000-000000000001",
    title: "First Older Article",
    content: "Detailed first content",
    publishedAt: "2026-08-01T10:00:00.000Z",
  },
];

describe("<BlogSection />", () => {
  it("shows a loading indicator while articles are being fetched", () => {
    // Given
    const pendingLoader = vi.fn(() => new Promise<Article[]>(() => {}));

    // When
    render(<BlogSection loader={pendingLoader} />);

    // Then
    expect(screen.getByText("Loading articles...")).toBeInTheDocument();
  });

  it("renders articles newest first with title and formatted date", async () => {
    // Given
    const loader = vi.fn().mockResolvedValue(sampleArticles);

    // When
    render(<BlogSection loader={loader} />);

    // Then
    const headings = await screen.findAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual([
      "Second Newer Article",
      "First Older Article",
    ]);
    expect(screen.getByText("Aug 12, 2026")).toBeInTheDocument();
    expect(screen.getByText("Aug 1, 2026")).toBeInTheDocument();
  });

  it("displays an empty state message when API returns no articles", async () => {
    // Given
    const loader = vi.fn().mockResolvedValue([]);

    // When
    render(<BlogSection loader={loader} />);

    // Then
    expect(
      await screen.findByText("No articles published yet."),
    ).toBeInTheDocument();
  });

  it("shows an error message and retries loading when user clicks Try again", async () => {
    // Given
    const loader = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(sampleArticles);

    // When
    render(<BlogSection loader={loader} />);
    const retryButton = await screen.findByRole("button", {
      name: "Try again",
    });
    expect(
      screen.getByText("Unable to load articles right now. Please try again."),
    ).toBeInTheDocument();

    fireEvent.click(retryButton);

    // Then
    expect(await screen.findByText("Second Newer Article")).toBeInTheDocument();
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it("aborts in-flight request and ignores late settlements when unmounted early", async () => {
    // Given
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    let capturedSignal: AbortSignal | undefined;
    let resolveDelayed!: (value: Article[]) => void;
    const loader = vi.fn((signal?: AbortSignal) => {
      capturedSignal = signal;
      return new Promise<Article[]>((resolve) => {
        resolveDelayed = resolve;
      });
    });

    // When
    const { unmount } = render(<BlogSection loader={loader} />);
    unmount();
    resolveDelayed(sampleArticles);
    await Promise.resolve();

    // Then
    expect(capturedSignal?.aborted).toBe(true);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
