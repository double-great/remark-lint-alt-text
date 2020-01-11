const rule = require("unified-lint-rule");
const visit = require("unist-util-visit");
const altText = require("@double-great/alt-text");

function checkAltText(ast, file) {
  const textToNodes = {};
  const aggregate = node => {
    const alt = node.alt || undefined;
    if (!alt) return;
    if (!textToNodes[alt]) {
      textToNodes[alt] = [];
    }
    textToNodes[alt].push(node);
  };

  visit(ast, "image", aggregate);

  return Object.keys(textToNodes).map(alt => {
    const nodes = textToNodes[alt];
    if (!nodes) return;
    nodes.forEach(node => {
      if (node.alt && altText(node.alt)) {
        file.message(altText(node.alt), node);
      }
    });
  });
}

module.exports = rule("remark-lint:alt-text", checkAltText);
