import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    viewportHeight: 1000,
    viewportWidth: 1000,
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
