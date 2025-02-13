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

import { readFile } from "node:fs/promises";

import { parseFeed } from "@rowanmanning/feed-parser";
import { XMLParser as XmlParser } from "fast-xml-parser";

import { assert } from "./assert.ts";
import { feedPathSeparator } from "./constants.ts";
import type {
  OpmlDocument,
  OpmlOutlineGroup,
  OpmlOutlineItem,
  SimpleFeed,
  SimpleFeedItem,
} from "./types.ts";

export async function readOpmlFile(
  opmlFilePath: string,
): Promise<OpmlDocument> {
  const data = await readFile(opmlFilePath, "utf8");

  const parser = new XmlParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    isArray: (tagName): boolean => tagName === "outline",
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return parser.parse(data) as OpmlDocument;
}

export function gatherFeeds(
  opmlDocument: OpmlDocument,
  callback: (feed: SimpleFeed) => void,
): void {
  walkOpmlOutline(
    opmlDocument.opml.body.outline,
    null,
    (opmlOutlineItem, path) => {
      callback({
        id: getFeedIdFromUrl(opmlOutlineItem.htmlUrl),
        htmlUrl: opmlOutlineItem.htmlUrl,
        xmlUrl: opmlOutlineItem.xmlUrl,
        title: opmlOutlineItem.text,
        path,
      });
    },
  );
}

export async function readFeed(feed: SimpleFeed): Promise<SimpleFeedItem[]> {
  const response = await fetch(feed.xmlUrl);
  const feedSource = await response.text();
  const feedContents = parseFeed(feedSource);

  return feedContents.items.map((item) => ({
    htmlUrl: assert(
      item.url,
      "`htmlUrl` is used as primary key, and cannot be null",
    ),
    title: item.title,
    content: item.content,
    decription: item.description,
    published: item.published ?? item.updated,
    updated: item.updated,
    feedId: feed.id,
  }));
}

function walkOpmlOutline(
  node:
    | OpmlOutlineGroup
    | OpmlOutlineItem
    | OpmlOutlineGroup[]
    | OpmlOutlineItem[],
  path: string | null,
  callback: (node: OpmlOutlineItem, path: string | null) => void,
): void {
  if (Array.isArray(node)) {
    for (const item of node) {
      walkOpmlOutline(item, path, callback);
    }
  } else if (isOpmlOutlineGroup(node)) {
    const newPath = `${path !== null ? path + feedPathSeparator : ""}${node.text ?? "Untitled"}`;
    walkOpmlOutline(node.outline, newPath, callback);
  } else {
    callback(node, path);
  }
}

function isOpmlOutlineGroup(
  node: OpmlOutlineGroup | OpmlOutlineItem,
): node is OpmlOutlineGroup {
  return Object.hasOwn(node, "outline");
}

function getFeedIdFromUrl(url: string): string {
  const parsedUrl = assert(URL.parse(url));
  return parsedUrl.hostname
    .toLowerCase()
    .replace(/^www\./u, "")
    .replace(/[^0-9a-z]+/gu, "-");
}
