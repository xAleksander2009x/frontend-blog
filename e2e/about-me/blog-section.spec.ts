import { expect, test } from "@playwright/test";

test.describe("About Me Blog Section", () => {
  test("displays articles returned by the API newest first", async ({
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
        body: JSON.stringify([
          {
            id: "5e1f0a2b-0001-4000-8000-000000000001",
            title: "Older Architecture Post",
            content: "First article body",
            publishedAt: "2026-08-01T10:00:00.000Z",
          },
          {
            id: "5e1f0a2b-0002-4000-8000-000000000002",
            title: "Newest TypeScript Guide",
            content: "Second article body",
            publishedAt: "2026-08-15T10:00:00.000Z",
          },
        ]),
      });
    });

    await page.goto("/");

    const articleHeadings = page.locator(
      "section[aria-labelledby='blog-section-heading'] h3",
    );
    await expect(articleHeadings).toHaveText([
      "Newest TypeScript Guide",
      "Older Architecture Post",
    ]);
    await expect(page.getByText("Aug 15, 2026")).toBeVisible();
    await expect(page.getByText("Aug 1, 2026")).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});
