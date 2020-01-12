const rule = require("unified-lint-rule");
const visit = require("unist-util-visit");
const visitParents = require("unist-util-visit-parents");
const altText = require("@double-great/alt-text");

function checkAltText(ast, file) {
  const textToNodes = {};
  let imageIsLink = false;
  let hasAltText = false;
  const aggregate = node => {
    const alt = node.alt || undefined;
    if (alt) hasAltText = true;
    if (!alt && !imageIsLink) return;
    if (!alt && imageIsLink) {
      file.message(
        "No alt text found: Images inside a link tag require alt text that describes the purpose of the link.",
        node
      );
    }
    if (!textToNodes[alt]) {
      textToNodes[alt] = [];
    }
    textToNodes[alt].push(node);
  };

  const visitorParents = (node, ancestors) => {
    imageIsLink = ancestors.filter(a => a.type === "link").length > 0;
  };

  visitParents(ast, "image", visitorParents);

  visit(ast, "image", aggregate);

  return Object.keys(textToNodes).map(alt => {
    const nodes = textToNodes[alt];
    if (!nodes) return;
    nodes.forEach(node => {
      if (node.alt && altText(node.alt)) {
        file.message(altText(node.alt), node);
      }
      if (imageIsLink && hasAltText) {
        file.message(
          "Images inside a link tag require alt text that describes the purpose of the link.",
          node
        );
      }
    });
  });
}

module.exports = rule("remark-lint:alt-text", checkAltText);
