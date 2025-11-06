import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    additionalData: `@use 'foundation' as *;`,
  },
  outputFileTracingRoot: process.cwd(),
  webpack: (config) => {
    // Enable camelCase access for classes with dashes in CSS Modules
    // Example: .header-container -> styles.headerContainer
    const maybeOneOfRule = config.module.rules.find((rule) => {
      return (
        typeof rule === "object" && rule !== null && "oneOf" in (rule as any)
      );
    }) as { oneOf?: any[] } | undefined;

    if (maybeOneOfRule && Array.isArray(maybeOneOfRule.oneOf)) {
      maybeOneOfRule.oneOf.forEach((rule) => {
        if (Array.isArray(rule.use)) {
          rule.use.forEach((use) => {
            if (
              use &&
              typeof use === "object" &&
              use.loader &&
              typeof use.loader === "string" &&
              use.loader.includes("css-loader") &&
              use.options &&
              use.options.modules
            ) {
              // Use 'dashes' to preserve original keys and add camelCased versions for dashed names
              use.options.modules.exportLocalsConvention = "dashes";
            }
          });
        }
      });
    }

    return config;
  },
};

export default nextConfig;
