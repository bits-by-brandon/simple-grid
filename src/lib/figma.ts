export function findFirstParentFrameWithGrid(node: BaseNode): FrameNode {
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

export function getGrid(node: FrameNode): LayoutGrid {
  if (!node.layoutGrids || node.layoutGrids.length === 0) {
    throw new Error("No layout grids found");
  }

  const grid = node.layoutGrids.find((grid) => grid.pattern === "COLUMNS");
  if (!grid) throw new Error("No column layout grid found");
  return grid;
}
