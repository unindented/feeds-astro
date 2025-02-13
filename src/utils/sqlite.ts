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

import type { DatabaseSyncOptions } from "node:sqlite";
import { DatabaseSync } from "node:sqlite";

import { feedItemsDefaultLimit } from "./constants.ts";
import type { SimpleFeed, SimpleFeedItem, SqliteFeedItem } from "./types.ts";

export function openDatabase(
  sqliteFilePath: string,
  options: DatabaseSyncOptions = {},
): DatabaseSync {
  return new DatabaseSync(sqliteFilePath, options);
}

export function openDatabaseReadOnly(sqliteFilePath: string): DatabaseSync {
  return openDatabase(sqliteFilePath, { readOnly: true });
}

export function createTables(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS feeds (
      id TEXT PRIMARY KEY,
      htmlUrl TEXT NOT NULL UNIQUE,
      xmlUrl TEXT NOT NULL UNIQUE,
      title TEXT UNIQUE,
      path TEXT
    );`);

  db.exec(`
    CREATE TABLE IF NOT EXISTS feedItems (
      htmlUrl TEXT PRIMARY KEY NOT NULL,
      title TEXT,
      published DATETIME,
      updated DATETIME,
      feedId TEXT NOT NULL,
      FOREIGN KEY (feedId) REFERENCES feeds(id) ON DELETE CASCADE
    );`);
}

export function replaceFeeds(db: DatabaseSync, feeds: SimpleFeed[]): void {
  const st = db.prepare(`
    REPLACE INTO feeds (id, htmlUrl, xmlUrl, title, path) 
    VALUES (?, ?, ?, ?, ?)`);
  for (const feed of feeds) {
    st.run(feed.id, feed.htmlUrl, feed.xmlUrl, feed.title, feed.path);
  }
}

export function replaceFeedItems(
  db: DatabaseSync,
  feedItems: SimpleFeedItem[],
): void {
  const st = db.prepare(`
    REPLACE INTO feedItems (htmlUrl, title, published, updated, feedId) 
    VALUES (?, ?, ?, ?, ?)`);
  for (const feedItem of feedItems) {
    st.run(
      feedItem.htmlUrl,
      feedItem.title,
      feedItem.published?.toISOString() ?? null,
      feedItem.updated?.toISOString() ?? null,
      feedItem.feedId,
    );
  }
}

export function getFeeds(db: DatabaseSync): SimpleFeed[] {
  const st = db.prepare(`
    SELECT id, htmlUrl, xmlUrl, title, path 
    FROM feeds
    ORDER BY path, title`);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return st.all() as SimpleFeed[];
}

export function getLatestFeedItems(
  db: DatabaseSync,
  limit = feedItemsDefaultLimit,
): SimpleFeedItem[] {
  const st = db.prepare(`
    SELECT htmlUrl, title, published, updated
    FROM feedItems
    ORDER BY updated DESC
    LIMIT ?`);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const rows = st.all(limit) as SqliteFeedItem[];
  return rows.map(fixFeedItem);
}

export function getFeedItemsForFeed(
  db: DatabaseSync,
  feedId: SimpleFeed["id"],
  limit = feedItemsDefaultLimit,
  offset = 0,
): SimpleFeedItem[] {
  const st = db.prepare(`
    SELECT htmlUrl, title, published, updated
    FROM feedItems
    WHERE feedId = ?
    ORDER BY updated DESC
    LIMIT ?
    OFFSET ?`);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const rows = st.all(feedId, limit, offset) as SqliteFeedItem[];
  return rows.map(fixFeedItem);
}

function fixFeedItem(feedItem: SqliteFeedItem): SimpleFeedItem {
  return {
    ...feedItem,
    published: fixFeedItemDate(feedItem.published),
    updated: fixFeedItemDate(feedItem.updated),
  };
}

function fixFeedItemDate(date: string | null): Date | null {
  return date !== null ? new Date(date) : null;
}
