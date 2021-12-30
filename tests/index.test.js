import { remark } from "remark";
import dedent from "dedent";
import plugin from "../";

const processMarkdown = (markdown, opts) => {
  return remark().use(plugin, opts).process(markdown);
};

it("End in period", async () => {
  const lint = await processMarkdown(dedent`
      # Title of my site

      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      ![alt texter](https://site.com/image.png)

      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    `);
  expect(lint.messages.length).toEqual(1);
  expect(lint.messages[0].reason).toMatchInlineSnapshot(
    `"Alt text should end with punctuation (https://git.io/JJk55)."`
  );
});

it("Image is a link", async () => {
  const lint = await processMarkdown(dedent`
      [![Puppies.](https://site.com/image.png)](https://website.org)
    `);
  expect(lint.messages.length).toEqual(1);
  expect(lint.messages[0].reason).toMatchInlineSnapshot(
    `"Images inside a link tag require alt text that describes the purpose of the link (https://git.io/JvfNj)."`
  );
});

it("Image is a link, should have alt text", async () => {
  const lint = await processMarkdown(dedent`
      [![](https://site.com/image.png)](https://website.org)
    `);
  expect(lint.messages.length).toEqual(1);
  expect(lint.messages[0].reason).toMatchInlineSnapshot(
    `"Images inside a link tag require alt text that describes the purpose of the link (https://git.io/JvfNj)."`
  );
});

it("No warnings", async () => {
  const lint = await processMarkdown(dedent`
      # Title of my site


      ![A large black dog.](https://site.com/doggie.png)

      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      ![A child holding a photograph.](https://site.com/kiddo.png)

    `);
  expect(lint.messages.length).toEqual(0);
});
