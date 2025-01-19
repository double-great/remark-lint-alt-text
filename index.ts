import { lintRule, Severity, Label } from "unified-lint-rule";
import { visitParents } from "unist-util-visit-parents";
import altText, {
  Config,
  defaultConfig,
  imageLink,
} from "@double-great/alt-text";
import { Node } from "unist";
import { VFile } from "vfile";
import { TransformCallback } from "unified";

type Plugin = (
  config?:
    | Label
    | Severity
    | Config
    | [level: Label | Severity, option?: Config | undefined]
    | undefined,
) =>
  | ((tree: Node, file: VFile, next: TransformCallback) => undefined)
  | undefined;

const checkAltText: Plugin = lintRule(
  {
    origin: "remark-lint:alt-text",
    url: "https://doublegreat.dev/remark-lint-alt-text/",
  },
  (tree: Node, file: VFile, options: Config): void => {
    options = {
      ...defaultConfig,
      ...options,
    };
    const textToNodes: { [alt: string]: TextNode[] } = {};
    let imageIsLink = false;
    let hasAltText = false;

    const aggregate = (node: TextNode, ancestors: TextNode[]) => {
      imageIsLink = ancestors.filter((a) => a.type === "link").length > 0;

      const { alt } = node;

      if (alt) hasAltText = true;

      if (!alt && !imageIsLink) {
        const suggestion = altText(undefined, options);
        if (suggestion) file.message(suggestion, node.position);
      }

      if (!alt && imageIsLink && options["image-is-link"] !== false) {
        file.message(imageLink.check(), node.position);
      }

      if (!alt) return;

      if (!textToNodes[alt]) {
        textToNodes[alt] = [];
      }
      textToNodes[alt].push(node);
    };

    visitParents(tree, "image", aggregate);

    for (const alt of Object.keys(textToNodes)) {
      const nodes = textToNodes[alt];
      if (!nodes) return;

      for (const node of nodes) {
        const suggestion = altText(node.alt, options);
        if (suggestion) file.message(suggestion, node.position);
        if (imageIsLink && !hasAltText && options["image-is-link"] !== false) {
          file.message(imageLink.check(), node.position);
        }
      }
    }
  },
);

export type TextNode = {
  type: "text" | "image" | "link";
  title: string | null;
  url?: string;
  alt?: string;
  value: string | undefined;
  position: {
    start: { line: number; column: number; offset?: number };
    end: { line: number; column: number; offset?: number };
    indent?: number[];
  };
  children: TextNode[];
};

export default checkAltText;
