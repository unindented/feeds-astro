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

import type { ListrTask } from "listr2";

import { assert } from "../../src/utils/assert.ts";
import {
  createTables,
  openDatabase,
  replaceFeedItems,
  replaceFeeds,
} from "../../src/utils/sqlite.ts";
import type { TasksContext } from "./types.ts";

export function openDatabaseTask(): ListrTask<TasksContext> {
  return {
    title: "Opening database",
    task: (ctx): void => {
      ctx.sqliteDatabase = openDatabase(ctx.sqliteFilePath);
    },
  };
}

export function closeDatabaseTask(): ListrTask<TasksContext> {
  return {
    title: "Closing database",
    task: (ctx): void => {
      ctx.sqliteDatabase?.close();
    },
  };
}

export function createTablesTask(): ListrTask<TasksContext> {
  return {
    title: "Creating tables",
    task: ({ sqliteDatabase }): void => {
      createTables(assert(sqliteDatabase));
    },
  };
}

export function replaceFeedsTask(): ListrTask<TasksContext> {
  return {
    title: "Replacing feeds",
    task: ({ sqliteDatabase, feeds }): void => {
      replaceFeeds(assert(sqliteDatabase), assert(feeds));
    },
  };
}

export function replaceFeedItemsTask(): ListrTask<TasksContext> {
  return {
    title: "Replacing feed items",
    task: ({ sqliteDatabase, feedItems }): void => {
      replaceFeedItems(assert(sqliteDatabase), assert(feedItems));
    },
  };
}
