import { findFirstParentFrameWithGrid } from "../lib/figma";
import { Command } from "../models/command";

export type SetToColumnParams = {
  width: string;
  offset?: string;
};

export class SetToColumn implements Command<SetToColumnParams> {
  getParams() {
    return ["width", "offset"] as const;
  }

  handleInput(inputEvent: ParameterInputEvent) {
    switch (inputEvent.key) {
      case "width":
        inputEvent.result.setSuggestions([]);
        break;
      case "offset":
        inputEvent.result.setSuggestions([]);
        break;
    }
  }

  run({ width, offset }: SetToColumnParams) {
    const parentFrame = findFirstParentFrameWithGrid(figma.currentPage.selection[0]);
    // @ts-ignore
    const { gutterSize, sectionSize, count } = getGrid(parentFrame);
    const paddedColumnWidth = sectionSize + gutterSize;
    const gridWidth = paddedColumnWidth * count - gutterSize;
    const startX = (parentFrame.width - gridWidth) / 2;

    for (const node of figma.currentPage.selection) {
      node.x = offset ? startX + paddedColumnWidth * parseInt(offset) : startX;

      // @ts-ignore
      node.resize(paddedColumnWidth * parseInt(width) - gutterSize, node.height);
    }
  }
}

export const setToColumn = new SetToColumn();
