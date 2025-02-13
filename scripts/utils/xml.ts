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

import { writeFile } from "node:fs/promises";

import type { Listr, ListrTask } from "listr2";

import { assert } from "../../src/utils/assert.ts";
import { gatherFeeds, readFeed, readOpmlFile } from "../../src/utils/xml.ts";
import type { TasksContext } from "./types.ts";

const feedsTaskConcurrency = 10;

export function readOpmlFileTask(): ListrTask<TasksContext> {
  return {
    title: "Reading OPML file",
    task: async (ctx): Promise<void> => {
      ctx.opmlDocument = await readOpmlFile(ctx.opmlFilePath);
    },
  };
}

export function gatherFeedsTask(): ListrTask<TasksContext> {
  return {
    title: "Gathering feeds",
    task: ({ opmlDocument, feeds }): void => {
      gatherFeeds(assert(opmlDocument), (feed) => {
        feeds.push(feed);
      });
    },
  };
}

export function readFeedsTask(): ListrTask<TasksContext> {
  return {
    title: "Reading feeds",
    task: ({ feeds, feedItems }, task): Listr<TasksContext> => {
      const subtasks: ListrTask<TasksContext>[] = feeds.map((feed) => ({
        title: feed.xmlUrl,
        task: async (): Promise<void> => {
          feedItems.push(...(await readFeed(feed)));
        },
        retry: 2,
      }));

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return task.newListr<TasksContext>(subtasks, {
        concurrent: feedsTaskConcurrency,
        collectErrors: "minimal",
        exitOnError: false,
      });
    },
  };
}

export function writeFeedsTask(): ListrTask<TasksContext> {
  return {
    title: "Writing feeds as JSON (for debugging purposes)",
    task: async (ctx): Promise<void> => {
      const data = { feeds: ctx.feeds, feedItems: ctx.feedItems };
      await writeFile("debug.json", JSON.stringify(data, null, 2), "utf-8");
    },
  };
}
