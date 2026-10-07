const { test, expect } = require("@playwright/test");

test("validation, role tabs and language stay usable", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("[data-role]")).toHaveCount(6);
  await page.locator("#riot-id").fill("invalid");
  await page.locator("#lookup-form").getByRole("button").click();
  await expect(page.locator("#status")).not.toHaveText("");

  await page.locator("#language-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.locator("[data-role=ADC]").click();
  await expect(page.locator("[data-role=ADC]")).toHaveClass(/active/);
});
