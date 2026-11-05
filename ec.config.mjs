import { defineEcConfig, ExpressiveCodeTheme } from "astro-expressive-code";
import darkTheme from "./src/styles/suites-code-theme.json" with { type: "json" };
import lightTheme from "./src/styles/suites-code-light-theme.json" with { type: "json" };

const suitesCodeTheme = ExpressiveCodeTheme.fromJSONString(
  JSON.stringify(darkTheme),
);

const suitesLightCodeTheme = ExpressiveCodeTheme.fromJSONString(
  JSON.stringify(lightTheme),
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
