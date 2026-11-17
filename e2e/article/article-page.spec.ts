import { expect, test } from "@playwright/test";

const mockArticles = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Architecture of a Modern Blog",
    content:
      "First paragraph explaining the architecture.\n\nSecond paragraph with <script>window.__xss = true;</script> safe text.",
    publishedAt: "2026-08-12T10:00:00.000Z",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    title: "End-to-End Testing with Playwright",
    content: "Complete guide to reliable browser tests.",
    publishedAt: "2026-08-05T10:00:00.000Z",
  },
];

test.describe("Article Page Flow", () => {
  test("navigates from About Me to an article page and returns back without page reload or console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.route("**/api/v1/articles", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockArticles),
      });
    });

    await page.route("**/api/v1/articles/*", async (route) => {
      const url = route.request().url();
      const id = url.split("/").pop();
      const found = mockArticles.find((article) => article.id === id);

      if (!found) {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({ message: "Not Found" }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(found),
      });
    });

    await page.goto("/");

    const articleLink = page.getByRole("link", {
      name: /Architecture of a Modern Blog/i,
    });
    await expect(articleLink).toBeVisible();
    await articleLink.click();

    await expect(page).toHaveURL(
      "/articles/11111111-1111-4111-8111-111111111111",
    );
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Architecture of a Modern Blog",
      }),
    ).toBeVisible();
    await expect(
      page.getByText("First paragraph explaining the architecture."),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Second paragraph with <script>window.__xss = true;</script> safe text.",
      ),
    ).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Aleksander Węgrzyn" }),
    ).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test("opens an article directly via deep link and shows not-found message for unknown article", async ({
    page,
  }) => {
    await page.route("**/api/v1/articles/*", async (route) => {
      const id = route.request().url().split("/").pop();
      const found = mockArticles.find((article) => article.id === id);

      if (!found) {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({ message: "Not Found" }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(found),
      });
    });

    await page.goto("/articles/22222222-2222-4222-8222-222222222222");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "End-to-End Testing with Playwright",
      }),
    ).toBeVisible();

    await page.goto("/articles/99999999-9999-4999-8999-999999999999");
    await expect(
      page.getByText("This article does not exist or may have been removed."),
    ).toBeVisible();
  });
});
