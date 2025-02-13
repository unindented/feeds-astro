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

export function truncateStringAtWord(
  str: string,
  lim: number,
  locale = "en-US",
  ending = "...",
): string {
  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  let lastWordBreak = -1;

  for (const word of segmenter.segment(str)) {
    if (word.isWordLike === true) {
      continue;
    }
    if (word.index >= lim) {
      break;
    }
    lastWordBreak = word.index;
  }

  return str.slice(0, lastWordBreak) + ending;
}

export function truncateStringAtSentence(
  str: string,
  lim: number,
  locale = "en-US",
  ending = "...",
): string {
  const segmenter = new Intl.Segmenter(locale, { granularity: "sentence" });
  let lastSentenceBreak = -1;

  for (const sentence of segmenter.segment(str)) {
    if (
      lastSentenceBreak !== -1 &&
      sentence.index + sentence.segment.length >= lim
    ) {
      break;
    }
    lastSentenceBreak = sentence.index + sentence.segment.length;
  }

  return str.slice(0, lastSentenceBreak).trim().slice(0, -1) + ending;
}
