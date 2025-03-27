import path from "path";
import * as vscode from "vscode";
import { BookmarkType } from "./BookmarkType";

export class Bookmark extends vscode.TreeItem {
  constructor(
    public label: string,
    public readonly path: string,
    public readonly type: BookmarkType
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);

    this.tooltip = `${this.label} – Bookmarked File`;
    this.description = this.type === "file" ? this.item_name : "Folder";

    this.command = {
      command: "bookmarks.openBookmark",
      title: "Open Bookmark",
      arguments: [this.path, this.type],
    };

    // Use VS Code's built-in file and folder icons
    this.iconPath = new vscode.ThemeIcon(
      this.type === "folder" ? "symbol-folder" : "file"
    );
    this.resourceUri = vscode.Uri.file(this.path);
  }

  public get item_name() {
    return path.basename(this.path);
  }
}
