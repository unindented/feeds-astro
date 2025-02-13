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

export interface OpmlDocument {
  opml: {
    body: OpmlOutlineGroup;
  };
}

export type OpmlOutline = OpmlOutlineGroup[] | OpmlOutlineItem[];

export interface OpmlOutlineGroup {
  text?: string;
  outline: OpmlOutline;
}

export interface OpmlOutlineItem {
  text: string;
  type: "rss";
  htmlUrl: string;
  xmlUrl: string;
}

export interface SimpleFeed {
  id: string;
  htmlUrl: string;
  xmlUrl: string;
  title: string | null;
  path: string | null;
}

export interface SimpleFeedItem {
  htmlUrl: string;
  title: string | null;
  published: Date | null;
  updated: Date | null;
  feedId: SimpleFeed["id"];
}

export interface SqliteFeedItem {
  htmlUrl: string;
  title: string | null;
  published: string | null;
  updated: string | null;
  feedId: SimpleFeed["id"];
}
