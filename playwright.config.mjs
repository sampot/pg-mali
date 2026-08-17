import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".kilo",
  testMatch: /smoke\.spec\.js$/,
  use: {
    baseURL: "http://127.0.0.1:8765",
    browserName: "chromium",
    headless: true,
  },
  timeout: 30000,
  expect: { timeout: 5000 },
});
