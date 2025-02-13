/**
 * Copyright 2025 Daniel Perez Alvarez
 *
 * This file is part of Astro Feeds.
 *
 * Astro Feeds is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * Astro Feeds is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Astro Feeds. If not, see <https://www.gnu.org/licenses/>.
 */

import { Listr } from "listr2";

import { opmlFilePath, sqliteFilePath } from "../src/utils/constants.ts";
import {
  closeDatabaseTask,
  createTablesTask,
  openDatabaseTask,
  replaceFeedItemsTask,
  replaceFeedsTask,
} from "./utils/sqlite.ts";
import type { TasksContext } from "./utils/types.ts";
import {
  gatherFeedsTask,
  readFeedsTask,
  readOpmlFileTask,
  writeFeedsTask,
} from "./utils/xml.ts";

await main();

async function main(): Promise<void> {
  const tasks = new Listr<TasksContext>(
    [
      readOpmlFileTask(),
      gatherFeedsTask(),
      readFeedsTask(),
      writeFeedsTask(),
      openDatabaseTask(),
      createTablesTask(),
      replaceFeedsTask(),
      replaceFeedItemsTask(),
      closeDatabaseTask(),
    ],
    {
      ctx: {
        opmlFilePath,
        opmlDocument: null,
        feeds: [],
        feedItems: [],
        sqliteFilePath,
        sqliteDatabase: null,
      },
      collectErrors: "minimal",
      exitOnError: false,
      renderer: "default",
      rendererOptions: { showErrorMessage: false },
    },
  );

  await tasks.run();

  if (tasks.errors.length > 0) {
    console.error("\nThe following errors occurred:");
    for (const error of tasks.errors) {
      console.error("-", error.path.join(" > "), "::", error.message);
    }
  }
}
