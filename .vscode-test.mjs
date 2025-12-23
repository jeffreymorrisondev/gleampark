import { defineConfig } from "@vscode/test-cli";

export default defineConfig([
  {
    label: "VS Code 1.75.0",
    version: "1.75.0",
    files: "out/test/**/*.test.js",
  },
  {
    label: "VS Code 1.80.0",
    version: "1.80.0",
    files: "out/test/**/*.test.js",
  },
  {
    label: "VS Code 1.85.0",
    version: "1.85.0",
    files: "out/test/**/*.test.js",
  },
  {
    label: "VS Code 1.90.0",
    version: "1.90.0",
    files: "out/test/**/*.test.js",
  },
  {
    label: "VS Code Stable",
    version: "stable",
    files: "out/test/**/*.test.js",
  },
]);
