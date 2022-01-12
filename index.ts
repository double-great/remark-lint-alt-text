import { lintRule } from "unified-lint-rule";
import { visitParents } from "unist-util-visit-parents";

import altText from "@double-great/alt-text";
import { createSuggestion } from "@double-great/alt-text/rules";

const checkAltText = lintRule("remark-lint:alt-text", (ast, file) => {
  const textToNodes = {};
  let imageIsLink = false;
  let hasAltText = false;

  const aggregate = (node, ancestors) => {
    imageIsLink = ancestors.filter((a) => a.type === "link").length > 0;
    const alt = node.alt || undefined;
    if (alt) hasAltText = true;
    if (!alt && !imageIsLink) return;
    if (!alt && imageIsLink) {
      file.message(createSuggestion("imageLink"), node);
    }
    if (!textToNodes[alt]) {
      textToNodes[alt] = [];
    }
    textToNodes[alt].push(node);
  };

  visitParents(ast, "image", aggregate);

  return Object.keys(textToNodes).map((alt) => {
    const nodes = textToNodes[alt];
    if (!nodes) return;
    nodes.forEach((node) => {
      if (node.alt && altText(node.alt)) {
        file.message(altText(node.alt), node);
      }
      if (imageIsLink && hasAltText) {
        file.message(createSuggestion("imageLink"), node);
      }
    });
  });
});

export default checkAltText;
