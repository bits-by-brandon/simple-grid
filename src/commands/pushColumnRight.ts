import { findFirstParentFrameWithGrid, getGrid } from "../lib/figma";
import { Command } from "../models/command";

export class PushColumnRight implements Command {
  getParams() {
    return [];
  }

  handleInput() {}

  run() {
    const parentFrame = findFirstParentFrameWithGrid(figma.currentPage.selection[0]);
    // @ts-ignore
    const { gutterSize, sectionSize } = getGrid(parentFrame);
    const paddedColumnWidth = sectionSize + gutterSize;

    for (const node of figma.currentPage.selection) {
      node.x += paddedColumnWidth;
    }
  }
}

export const pushColumnRight = new PushColumnRight();
