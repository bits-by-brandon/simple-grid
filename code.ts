function findFirstParentFrameWithGrid(node: BaseNode): FrameNode {
  if (node.type === "FRAME" && node.layoutGrids.length > 0) {
    for (const grid of node.layoutGrids) {
      if (grid.visible && grid.pattern === "COLUMNS") {
        if (grid.alignment !== "CENTER") {
          throw new Error("Simple Grid only works with centered grids at this time.");
        }
        return node;
      }
    }
  }

  const parent = node.parent;
  if (parent) {
    return findFirstParentFrameWithGrid(parent);
  }

  throw new Error("No grid frame found");
}

function getGrid(node: FrameNode): LayoutGrid {
  if (!node.layoutGrids || node.layoutGrids.length === 0) {
    throw new Error("No layout grids found");
  }

  const grid = node.layoutGrids.find((grid) => grid.pattern === "COLUMNS");
  if (!grid) throw new Error("No column layout grid found");
  return grid;
}

try {
  figma.parameters.on("input", ({ parameters, key, result }: ParameterInputEvent) => {
    if (figma.currentPage.selection.length === 0) {
      throw new Error("Select a node before running this plugin");
    }

    const parentFrame = findFirstParentFrameWithGrid(figma.currentPage.selection[0]);
    const grid = getGrid(parentFrame);
  });

  type GridParams = {
    width: string;
    offset?: string;
  };

  // @ts-ignore
  figma.on("run", ({ parameters }: RunEvent<GridParams>) => {
    const { width, offset } = parameters;
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
    figma.closePlugin();
  });
} catch (error: any) {
  figma.closePlugin(error.toString());
}
