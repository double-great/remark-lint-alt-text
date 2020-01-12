const rule = require("unified-lint-rule");
const visit = require("unist-util-visit");
var visitParents = require("unist-util-visit-parents");

const altText = require("@double-great/alt-text");

function checkAltText(ast, file) {
  const textToNodes = {};
  let imageIsLink = false;
  const aggregate = node => {
    const alt = node.alt || undefined;
    if (!alt) return;
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
      if (imageIsLink) {
        file.message("Alt text should describe the link, not the image.", node);
      }
    });
  });
}

module.exports = rule("remark-lint:alt-text", checkAltText);
