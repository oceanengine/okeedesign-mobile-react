/**
 * as tree is a component of library, use prefix "Struct" to distinguish
 */

export type StructTreeValue = string | number | object;

export type StructTreeOption = {
  value: StructTreeValue;
  label: string;
};
export interface StructTreeNode extends StructTreeOption {
  children?: StructTreeNode[];
  needLoad?: boolean;
  showAll?: boolean;
}
export type StructTree = StructTreeNode[];

export type StructFlatTree = StructTreeOption[][];

export type TreeNodeOperator<T = void> = (node: StructTreeNode) => T;

export function findTreeNode(tree: StructTree, value: StructTreeValue): StructTreeNode | null {
  let matchedNode = null;
  tree.some(treeNode => {
    if (treeNode.value === value) {
      matchedNode = treeNode;
      return true;
    }
  });
  return matchedNode;
}

/**
 * trace the tree by value
 */
export function traceTreeByValue(
  tree: StructTree,
  value: StructTreeValue[],
  operator: TreeNodeOperator,
): void {
  value.forEach(singleValue => {
    const node = findTreeNode(tree, singleValue);
    if (node) {
      operator(node);
      tree = node.children || [];
    }
  });
}

/**
 * walk the tree along first branch
 */
export function walkTree(tree: StructTree, operator: TreeNodeOperator): void {
  while (tree.length) {
    const node = tree[0];
    if (node) {
      operator(node);
      tree = node.children || [];
    }
  }
}
