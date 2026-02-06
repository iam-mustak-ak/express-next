import { defineConfig } from '@rsbuild/core';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import fs from 'node:fs';
import path from 'node:path';

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

const externals = [...Object.keys(pkg.dependencies || {})];

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
      bin: './src/bin.ts',
    },
  },
  output: {
    target: 'node',
    distPath: {
      root: 'dist',
    },
    cleanDistPath: true,
  },
  tools: {
    rspack: (config, { rspack }) => {
      config.externals = externals;
      config.externalsType = 'module';

      config.experiments = {
        ...config.experiments,
        outputModule: true,
      };

      config.output = {
        ...config.output,
        module: true,
        library: {
          type: 'module',
        },
        chunkFormat: 'module',
      };

      config.plugins?.push(
        new rspack.BannerPlugin({
          banner:
            'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
          raw: true,
          entryOnly: true,
          include: /bin\.js$/,
        }),
        new rspack.BannerPlugin({
          banner: '#!/usr/bin/env node',
          raw: true,
          entryOnly: true,
          include: /bin\.js$/,
        }),
      );
      return config;
    },
  },
  plugins: [pluginTypeCheck()],
});
