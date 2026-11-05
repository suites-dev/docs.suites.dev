import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { defineEcConfig, ExpressiveCodeTheme } from "astro-expressive-code";

const suitesCodeTheme = ExpressiveCodeTheme.fromJSONString(
  fs.readFileSync(
    fileURLToPath(
      new URL("./src/styles/suites-code-theme.json", import.meta.url),
    ),
    "utf-8",
  ),
);

const suitesLightCodeTheme = ExpressiveCodeTheme.fromJSONString(
  fs.readFileSync(new URL("./src/styles/suites-code-light-theme.json", import.meta.url), "utf-8"),
);

export default defineEcConfig({
  themes: [suitesCodeTheme, suitesLightCodeTheme],
  themeCssSelector: (theme) => `[data-theme="${theme.type}"]`,
  useDarkModeMediaQuery: false,
  styleOverrides: {
    borderColor: "var(--border-strong)",
    frames: { frameBoxShadowCssValue: "none" },
  },
});
