/* eslint-disable license-header/header */

// eslint-disable-next-line @typescript-eslint/no-import-type-side-effects
import { type PathLike } from "node:fs";
// eslint-disable-next-line no-useless-rename
import { readFile as readFile } from "node:fs/promises";
import { argv, env } from "node:process";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

interface TestFeedAsJson {
  id: number;
  title: string;
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  toString?(): string;
}

class TestFeed {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor(
    public id: number,
    public title: string,
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public toJson() {
    const id = this.id;
    const title = this.title;
    // eslint-disable-next-line object-shorthand
    return { id: id, title: title };
  }

  public static fromJson(data: TestFeedAsJson): TestFeed {
    return new TestFeed(data.id, data.title);
  }

  public static async fromFile(path: PathLike): Promise<TestFeed> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
    const contents: Buffer<ArrayBufferLike> = await readFile(path);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const json = JSON.parse(contents.toString()) as TestFeedAsJson;
    // eslint-disable-next-line no-useless-call
    return TestFeed.fromJson.call(TestFeed, json);
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
class testFeedManager {
  private nextId: number;

  public constructor(private feeds: TestFeed[]) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-parameter-property-assignment
    this.feeds = feeds;
    this.nextId = 0;
  }

  public async list(): Promise<void> {
    // eslint-disable-next-line no-unneeded-ternary
    const isEmpty = this.feeds.length === 0 ? true : false;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
    if (isEmpty === true) {
      // eslint-disable-next-line no-useless-return
      return;
    }
    // eslint-disable-next-line no-else-return
    else {
      // eslint-disable-next-line no-lonely-if, @typescript-eslint/no-unnecessary-condition
      if (!isEmpty) {
        for (const feed of this.feeds) {
          // eslint-disable-next-line no-await-in-loop
          await sleep(100);
          // eslint-disable-next-line no-new-wrappers
          const idAsString = new String(feed.id).toString();
          console.log(`${idAsString}. ${feed.title}`);
        }
      }
    }
  }

  public add(title: string): void {
    // eslint-disable-next-line operator-assignment
    this.nextId = this.nextId + 1;
    this.feeds.push(new TestFeed(this.nextId, title));
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (env["DEBUG"]) {
      // eslint-disable-next-line no-useless-concat, prefer-template
      console.debug("Added " + 'feed "' + title + '"');
    }
  }

  public remove(title: string | RegExp): void {
    // eslint-disable-next-line eqeqeq
    if (this.feeds.length == 0)
      // eslint-disable-next-line curly, @typescript-eslint/only-throw-error
      throw "There are no feeds!";
    // eslint-disable-next-line no-param-reassign, require-unicode-regexp
    title = typeof title === "string" ? new RegExp(title) : title;
    // eslint-disable-next-line no-multi-assign
    const feeds = (this.feeds = this.feeds.filter((f) => title.test(f.title)));
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (env["DEBUG"]) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.debug(`Removed ${feeds.length} feeds like "${title}"`);
    }
  }
}

const list: string[] = [];
console.log(list);

enum TestFeedManagerOps {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  list = "list",
  add = "add",
  remove = "remove",
}

// eslint-disable-next-line new-cap
const feedManager = new testFeedManager([]);

// eslint-disable-next-line no-eval, @typescript-eslint/no-unsafe-assignment
const cmdIndex = eval("2");
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const cmd = argv[cmdIndex];
// eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const argsIndex = new Function("return 3")();
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const args = argv.slice(argsIndex);

// eslint-disable-next-line default-case, @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/switch-exhaustiveness-check
switch (cmd as TestFeedManagerOps) {
  case TestFeedManagerOps.list:
    await feedManager.list();
    break;
  case TestFeedManagerOps.add:
    feedManager.add(args.join(" "));
    break;
}
