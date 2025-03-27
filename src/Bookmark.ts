import path from "path";
import * as vscode from "vscode";

export class Bookmark extends vscode.TreeItem {
  constructor(public label: string, public readonly path: string) {
    super(label, vscode.TreeItemCollapsibleState.None);

    this.tooltip = `${this.label} – Bookmarked File`;
    this.description = this.file_name;

    this.command = {
      command: "bookmarks.openBookmark",
      title: "Open Bookmark",
      arguments: [this.path],
    };

    // Use VS Code's built-in file icons
    this.iconPath = new vscode.ThemeIcon("file");
    this.resourceUri = vscode.Uri.file(this.path);
  }

  public get file_name() {
    return path.basename(this.path);
  }
}
