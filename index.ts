import { lintRule } from "unified-lint-rule";
import { visitParents } from "unist-util-visit-parents";
import altText, { Config, defaultConfig } from "@double-great/alt-text";
import imageLink from "@double-great/alt-text/dist/clues/image-link.js";
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
  (tree: Node, file: VFile, options: Config): void => {
    options = {
      ...defaultConfig,
      ...options,
    };
    const textToNodes: { [alt: string]: textNode[] } = {};
    let imageIsLink = false;
    let hasAltText = false;

    const aggregate = (node: textNode, ancestors: textNode[]) => {
      imageIsLink = ancestors.filter((a) => a.type === "link").length > 0;
      const { alt } = node;
      if (alt) hasAltText = true;
      if (!alt && !imageIsLink) {
        const suggestion = altText(undefined, options);
        if (suggestion) file.message(suggestion, node);
      }
      if (!alt && imageIsLink && options["image-is-link"] !== false) {
        file.message(imageLink.check(), node);
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
      for (const node of nodes) {
        const suggestion = altText(node.alt, options);
        if (suggestion) file.message(suggestion, node);
        if (imageIsLink && hasAltText && options["image-is-link"] !== false) {
          file.message(imageLink.check(), node);
        }
      }
    });
  }
);

export default checkAltText;
