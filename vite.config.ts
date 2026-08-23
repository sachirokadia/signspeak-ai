// @lovable.dev/vite-tanstack-config provides the TanStack Start, React, Tailwind,
// Nitro, and development integrations used by this project.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const lovableConfig = defineConfig({
  vite: {
    resolve: { tsconfigPaths: true },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts.
    server: { entry: "server" },
  },
});

export default async (env: Parameters<typeof lovableConfig>[0]) => {
  const config = await lovableConfig(env);

  return {
    ...config,
    resolve: {
      ...config.resolve,
      tsconfigPaths: true,
    },
    // Vite 8 resolves tsconfig paths natively. The Lovable wrapper still adds
    // its legacy plugin, so remove that plugin from the final config to avoid
    // duplicate path resolution and the Vite deprecation warning.
    plugins: config.plugins?.filter((plugin) => {
      if (!plugin || Array.isArray(plugin) || typeof plugin !== "object") {
        return true;
      }
      if (!("name" in plugin)) {
        return true;
      }
      return plugin.name !== "vite-tsconfig-paths" && plugin.name !== "vite-plugin-tsconfig-paths";
    }),
  };
};
