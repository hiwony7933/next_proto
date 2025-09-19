import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    additionalData: `@use 'variable' as *; @use 'mixin' as *;`,
  },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
