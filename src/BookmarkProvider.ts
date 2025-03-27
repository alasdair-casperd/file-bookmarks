import path from "path";
import * as vscode from "vscode";

export class BookmarkProvider implements vscode.TreeDataProvider<Bookmark> {
  constructor(private workspace_root: string | undefined) {}

  getTreeItem = (element: Bookmark): vscode.TreeItem => {
    return element;
  };

  getChildren = async (element?: Bookmark): Promise<Bookmark[]> => {
    // Only the root (element === undefined) should have children
    if (element) return [];

    // Return a test bookmark
    return [
      new Bookmark("Test Bookmark", "test_1.txt", "/", this.workspace_root),
      new Bookmark("Test Bookmark 1", "test_2.txt", "/", this.workspace_root),
      new Bookmark("Test Bookmark 2", "test_3.txt", "/", this.workspace_root),
      new Bookmark("Test Bookmark 3", "test_4.txt", "/", this.workspace_root),
      new Bookmark("Test Bookmark 4", "test_5.txt", "/", this.workspace_root),
    ];
  };
}

export class Bookmark extends vscode.TreeItem {
  constructor(
    public label: string,
    public readonly file_name: string,
    public readonly folder_path: string,
    private readonly workspace_root: string | undefined
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);

    this.tooltip = `${this.label} – Bookmarked File`;
    this.description = file_name;

    this.command = {
      command: "bookmarks.openBookmark",
      title: "Open Bookmark",
      arguments: [this],
    };
  }

  public get file_path() {
    return path.join(
      this.workspace_root || "",
      this.folder_path,
      this.file_name
    );
  }
}
