import { mergeAttributes, Node } from "@tiptap/core";

export const JournalFigure = Node.create({
  name: "journalFigure",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      caption: { default: "" },
    };
  },
  parseHTML() {
    return [{ tag: "figure[data-journal-figure]" }];
  },
  renderHTML({ HTMLAttributes }) {
    const { src, alt, caption, ...figureAttributes } = HTMLAttributes;
    return [
      "figure",
      mergeAttributes({ "data-journal-figure": "", class: "journal-figure" }, figureAttributes),
      ["img", { src, alt }],
      ["figcaption", {}, caption],
    ];
  },
});
