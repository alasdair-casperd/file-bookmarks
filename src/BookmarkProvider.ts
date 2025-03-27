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
    return [
      new Bookmark("Test Bookmark", "file.txt"),
      new Bookmark("Test Bookmark 1", "file.txt"),
      new Bookmark("Test Bookmark 2", "file.txt"),
      new Bookmark("Test Bookmark 3", "file.txt"),
      new Bookmark("Test Bookmark 4", "file.txt"),
    ];
  };
}

class Bookmark extends vscode.TreeItem {
  constructor(public label: string, public readonly file_name: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = `${this.label} – Bookmarked File`;
    this.description = file_name;
  }
}
