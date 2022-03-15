import { lintRule } from "unified-lint-rule";
import { visitParents } from "unist-util-visit-parents";
import altText from "@double-great/alt-text";
import { createSuggestion } from "@double-great/alt-text/dist/rules";
import { VFile, Node } from "unified-lint-rule/lib";

type textNode = {
  type: string;
  title: string | null;
  url: string;
  alt: string | undefined;
  position: string[];
};

const checkAltText = lintRule(
  "remark-lint:alt-text",
  (tree: Node, file: VFile): void => {
    const textToNodes: { [alt: string]: textNode[] } = {};
    let imageIsLink = false;
    let hasAltText = false;

    const aggregate = (node: textNode, ancestors: textNode[]) => {
      imageIsLink = ancestors.filter((a) => a.type === "link").length > 0;
      const { alt } = node;
      if (alt) hasAltText = true;
      if (!alt && !imageIsLink) return;
      if (!alt && imageIsLink) {
        file.message(createSuggestion("imageLink"), node);
      }
      if (!alt) return;
      if (!textToNodes[alt]) {
        textToNodes[alt] = [];
      }
      textToNodes[alt].push(node);
    };

    visitParents(tree, "image", aggregate);

    Object.keys(textToNodes).map((alt) => {
      const nodes = textToNodes[alt];
      if (!nodes) return;
      nodes.forEach((node) => {
        if (hasAltText) {
          const suggestion = altText(node.alt);
          if (suggestion) file.message(suggestion, node);
        }
        if (imageIsLink && hasAltText) {
          file.message(createSuggestion("imageLink"), node);
        }
      });
    });
  }
);

export default checkAltText;
