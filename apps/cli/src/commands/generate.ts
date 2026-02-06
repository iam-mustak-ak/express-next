import { Command } from 'commander';
import { generateResource } from './generate.generator.js';

export const generate = new Command()
  .name('generate')
  .alias('g')
  .description('Generate a new feature (controller, routes, test)')
  .argument('<name>', 'Name of the feature (e.g. users, blogs)')
  .action(async (name) => {
    await generateResource(name);
  });
