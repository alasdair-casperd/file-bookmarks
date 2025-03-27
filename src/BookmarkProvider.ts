import * as vscode from "vscode";

export class BookmarkProvider implements vscode.TreeDataProvider<Bookmark> {
  constructor(private workspaceRoot: string | undefined) {}

  getTreeItem = (element: Bookmark): vscode.TreeItem => {
    return element;
  };

  getChildren = async (element?: Bookmark): Promise<Bookmark[]> => {
    // Only the root (element === undefined) should have children
    if (element) return [];

    // Return a test bookmark
    return [new Bookmark("Test Bookmark")];
  };
}

class Bookmark extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = `${this.label} test`;
    this.description = `${this.label} test`;
  }
}
