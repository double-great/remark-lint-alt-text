const test = require("tape");
const remark = require("remark");
const dedent = require("dedent");
const plugin = require("../");

const processMarkdown = (markdown, opts) => {
  return remark()
    .use(plugin, opts)
    .process(markdown);
};

test("End in period", assert => {
  const lint = processMarkdown(dedent`
      # Title of my site

      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      ![alt texter](https://site.com/image.png)

      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    `);
  return lint.then(vFile => {
    assert.equal(vFile.messages.length, 1);
    assert.equal(vFile.messages[0].reason, "Alt text should end in a period.");
    assert.end();
  });
});

test("Image is a link", assert => {
  const lint = processMarkdown(dedent`
      [![Puppies.](https://site.com/image.png)](https://website.org)
    `);
  return lint.then(vFile => {
    assert.equal(vFile.messages.length, 1);
    assert.equal(
      vFile.messages[0].reason,
      "Alt text should describe the link, not the image."
    );
    assert.end();
  });
});

test("No warnings", assert => {
  const lint = processMarkdown(dedent`
      # Title of my site


      ![A large black dog.](https://site.com/doggie.png)

      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      ![A child holding a photograph.](https://site.com/kiddo.png)

    `);
  return lint.then(vFile => {
    assert.equal(vFile.messages.length, 0);
    assert.end();
  });
});
