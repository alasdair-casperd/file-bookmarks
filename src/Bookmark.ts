import path from "path";
import * as vscode from "vscode";
import { BookmarkType } from "./BookmarkType";

export class Bookmark extends vscode.TreeItem {
  constructor(
    public label: string,
    public readonly uri: vscode.Uri,
    public readonly type: BookmarkType
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);

    this.tooltip = `${this.label} – Bookmarked File`;
    this.description = this.item_name;

    this.command = {
      command: "file-bookmarks.openBookmark",
      title: "Open Bookmark",
      arguments: [this.uri, this.type],
    };

    // Use VS Code's built-in file and folder icons
    this.iconPath = new vscode.ThemeIcon(
      this.type === "folder" ? "symbol-folder" : "file"
    );

    this.resourceUri = this.uri;
  }

  public get item_name() {
    return path.basename(this.uri.path);
  }
}
