import { AxiosError, AxiosHeaders } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ArticleNotFoundError,
  fetchArticleById,
  fetchArticles,
  sortArticlesNewestFirst,
} from "./articlesApi";
import { apiClient } from "./client/apiClient";
import type { Article } from "./schemas/article.schema";

vi.mock("./client/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const sampleArticleA: Article = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Older Post",
  content: "First paragraph.\n\nSecond paragraph.",
  publishedAt: "2026-08-01T10:00:00.000Z",
};

const sampleArticleB: Article = {
  id: "22222222-2222-4222-8222-222222222222",
  title: "Newer Post",
  content: "Fresh content.",
  publishedAt: "2026-08-15T12:30:00.000Z",
};

describe("articlesApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sortArticlesNewestFirst", () => {
    it("sorts articles in descending order by publishedAt without mutating input", () => {
      // Given
      const unsorted = [sampleArticleA, sampleArticleB];

      // When
      const sorted = sortArticlesNewestFirst(unsorted);

      // Then
      expect(sorted.map((item) => item.id)).toEqual([
        sampleArticleB.id,
        sampleArticleA.id,
      ]);
      expect(unsorted[0]?.id).toBe(sampleArticleA.id);
    });
  });

  describe("fetchArticles", () => {
    it("fetches, validates, and returns articles sorted newest first", async () => {
      // Given
      const controller = new AbortController();
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: [sampleArticleA, sampleArticleB],
      });

      // When
      const result = await fetchArticles(controller.signal);

      // Then
      expect(apiClient.get).toHaveBeenCalledWith("/api/v1/articles", {
        signal: controller.signal,
      });
      expect(result.map((item) => item.id)).toEqual([
        sampleArticleB.id,
        sampleArticleA.id,
      ]);
    });

    it("throws a validation error when API returns invalid shape", async () => {
      // Given
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: [{ id: "not-a-uuid", title: "" }],
      });

      // When & Then
      await expect(fetchArticles()).rejects.toThrow();
    });
  });

  describe("fetchArticleById", () => {
    it("fetches and validates a single article by UUID", async () => {
      // Given
      const controller = new AbortController();
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: sampleArticleA,
      });

      // When
      const result = await fetchArticleById(
        sampleArticleA.id,
        controller.signal,
      );

      // Then
      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/v1/articles/${sampleArticleA.id}`,
        { signal: controller.signal },
      );
      expect(result).toEqual(sampleArticleA);
    });

    it("throws ArticleNotFoundError without calling API when ID is not a valid UUID", async () => {
      // Given
      const invalidId = "not-a-valid-uuid";

      // When & Then
      await expect(fetchArticleById(invalidId)).rejects.toBeInstanceOf(
        ArticleNotFoundError,
      );
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it("throws ArticleNotFoundError when API responds with 404", async () => {
      // Given
      const missingId = "33333333-3333-4333-8333-333333333333";
      const notFoundError = new AxiosError(
        "Request failed with status code 404",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        {
          status: 404,
          statusText: "Not Found",
          headers: {},
          config: { headers: new AxiosHeaders() },
          data: { message: "Article not found" },
        },
      );
      vi.mocked(apiClient.get).mockRejectedValueOnce(notFoundError);

      // When & Then
      await expect(fetchArticleById(missingId)).rejects.toBeInstanceOf(
        ArticleNotFoundError,
      );
    });

    it("rethrows unexpected network or server errors", async () => {
      // Given
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error("Network down"));

      // When & Then
      await expect(fetchArticleById(sampleArticleA.id)).rejects.toThrow(
        "Network down",
      );
    });

    it("throws a validation error when single article payload has invalid shape", async () => {
      // Given
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { id: sampleArticleA.id, title: "Missing content and date" },
      });

      // When & Then
      await expect(fetchArticleById(sampleArticleA.id)).rejects.toThrow();
    });
  });
});
