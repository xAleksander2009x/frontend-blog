import { describe, expect, it, vi } from "vitest";
import { fetchArticles } from "./articlesApi";
import {
  apiClient,
  DEFAULT_API_BASE_URL,
  getApiBaseUrl,
} from "./client/apiClient";

describe("articlesApi", () => {
  it("returns default API base URL when environment variable is empty", () => {
    // Given
    const emptyEnv = "   ";

    // When
    const resolved = getApiBaseUrl(emptyEnv);

    // Then
    expect(resolved).toBe(DEFAULT_API_BASE_URL);
  });

  it("returns configured API base URL when provided", () => {
    // Given
    const customUrl = "https://example.com";

    // When
    const resolved = getApiBaseUrl(customUrl);

    // Then
    expect(resolved).toBe("https://example.com");
  });

  it("fetches, validates with Zod, and sorts articles newest first", async () => {
    // Given
    const olderArticle = {
      id: "5e1f0a2b-0001-4000-8000-000000000001",
      title: "Older Post",
      content: "Content of older post",
      publishedAt: "2026-08-01T10:00:00.000Z",
    };
    const newerArticle = {
      id: "5e1f0a2b-0002-4000-8000-000000000002",
      title: "Newer Post",
      content: "Content of newer post",
      publishedAt: "2026-08-10T10:00:00.000Z",
    };
    const getSpy = vi
      .spyOn(apiClient, "get")
      .mockResolvedValueOnce({ data: [olderArticle, newerArticle] });

    // When
    const result = await fetchArticles();

    // Then
    expect(getSpy).toHaveBeenCalledWith("/api/v1/articles", {
      signal: undefined,
    });
    expect(result).toEqual([newerArticle, olderArticle]);
    getSpy.mockRestore();
  });

  it("throws a validation error when API response does not match the Zod schema", async () => {
    // Given
    const invalidPayload = [{ id: "not-a-uuid", title: "" }];
    const getSpy = vi
      .spyOn(apiClient, "get")
      .mockResolvedValueOnce({ data: invalidPayload });

    // When & Then
    await expect(fetchArticles()).rejects.toThrow();
    getSpy.mockRestore();
  });
});
