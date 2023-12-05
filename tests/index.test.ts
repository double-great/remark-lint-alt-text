import { remark } from "remark";
import dedent from "dedent";
import plugin from "../index.js";
import { Config } from "@double-great/alt-text";

const processMarkdown = (markdown: string, opts?: Config) => {
  return remark().use(plugin, opts).process(markdown);
};

describe("No warnings", () => {
  it("passes", async () => {
    const lint = await processMarkdown(dedent`
      # Title of my site


      ![A large black dog.](https://site.com/doggie.png)

      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      ![A child holding a photograph.](https://site.com/kiddo.png)

    `);
    expect(lint.messages.length).toEqual(0);
  });
});

describe("End in period", () => {
  it("throws", async () => {
    const lint = await processMarkdown(dedent`
      # Title of my site

      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      ![alt texter](https://site.com/image.png)

      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    `);
    expect(lint.messages.length).toEqual(1);
    expect(lint.messages[0].reason).toMatchInlineSnapshot(
      `"Alt text should end with punctuation (https://tinyurl.com/y9fcquhy)."`,
    );
  });

  it("disabled", async () => {
    const lint = await processMarkdown(
      dedent`
      # Title of my site

      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      ![alt texter](https://site.com/image.png)

      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    `,
      { "end-with-punctuation": false },
    );
    expect(lint.messages.length).toEqual(0);
  });
});

describe("Image is a link", () => {
  it("does not throw", async () => {
    const lint = await processMarkdown(dedent`
      [![Puppies.](https://site.com/image.png)](https://website.org)
    `);
    expect(lint.messages.length).toEqual(0);
  });

  it("throws", async () => {
    const lint = await processMarkdown(dedent`
      [![](https://site.com/image.png)](https://website.org)
    `);
    expect(lint.messages.length).toEqual(1);
    expect(lint.messages[0].reason).toMatchInlineSnapshot(
      `"Images inside a link tag require alt text that describes the purpose of the link (https://tinyurl.com/y7s7je5u)."`,
    );
  });

  it("disabled", async () => {
    const lint = await processMarkdown(
      dedent`
      [![](https://site.com/image.png)](https://website.org)
    `,
      { "image-is-link": false },
    );
    expect(lint.messages.length).toEqual(0);
  });
});

describe("Empty alt text", () => {
  it("throws", async () => {
    const lint = await processMarkdown(dedent`
      # Title of my site


      ![](https://site.com/doggie.png)

    `);
    expect(lint.messages.length).toEqual(1);
    expect(lint.messages[0].reason).toMatchInlineSnapshot(
      `"Empty alt text should only be used for decorative images (https://tinyurl.com/y8mlwswv)."`,
    );
  });

  it("disabled", async () => {
    const lint = await processMarkdown(
      dedent`
      # Title of my site


      ![](https://site.com/doggie.png)

    `,
      { "image-is-decorative": false },
    );
    expect(lint.messages.length).toEqual(0);
  });
});
