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

import type { DatabaseSync } from "node:sqlite";

import type {
  OpmlDocument,
  SimpleFeed,
  SimpleFeedItem,
} from "../../src/utils/types.ts";

export interface TasksContext {
  opmlFilePath: string;
  opmlDocument: OpmlDocument | null;
  feeds: SimpleFeed[];
  feedItems: SimpleFeedItem[];

  sqliteFilePath: string;
  sqliteDatabase: DatabaseSync | null;
}
