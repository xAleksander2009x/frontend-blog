import { expect, test } from "@playwright/test";

test.describe("About Me Home Page", () => {
  test("displays the author name as main heading and allows keyboard navigation", async ({
    page,
  }) => {
    await page.goto("/");

    const mainHeading = page.getByRole("heading", {
      level: 1,
      name: "Aleksander Węgrzyn",
    });
    await expect(mainHeading).toBeVisible();

    await page.keyboard.press("Tab");
    const githubLink = page.getByRole("link", { name: "GitHub" });
    await expect(githubLink).toBeFocused();
  });

  test("renders without horizontal overflow on mobile (360px) and desktop (1440px)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    const mobileOverflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(mobileOverflow).toBe(false);

    await page.setViewportSize({ width: 1440, height: 900 });
    const desktopOverflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(desktopOverflow).toBe(false);
  });
});
