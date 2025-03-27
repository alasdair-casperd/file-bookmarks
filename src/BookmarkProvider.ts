import * as vscode from "vscode";
import { Bookmark } from "./Bookmark";
import { BookmarkType } from "./BookmarkType";

export class BookmarkProvider implements vscode.TreeDataProvider<Bookmark> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    Bookmark | undefined | void
  > = new vscode.EventEmitter<Bookmark | undefined | void>();

  readonly onDidChangeTreeData: vscode.Event<Bookmark | undefined | void> =
    this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {}

  getTreeItem = (element: Bookmark): vscode.TreeItem => {
    return element;
  };

  getChildren = async (element?: Bookmark): Promise<Bookmark[]> => {
    // Only the root (element === undefined) should have children
    if (element) return [];

    const storedBookmarks = this.context.workspaceState.get<Bookmark[]>(
      "file-bookmarks",
      []
    );

    return storedBookmarks.map(
      (bookmark) => new Bookmark(bookmark.label, bookmark.uri, bookmark.type)
    );
  };

  /**
   * Bookmark a file or a folder.
   * @param label
   * @param path
   * @param type
   */
  addBookmark = async (label: string, uri: vscode.Uri, type: BookmarkType) => {
    const storedBookmarks = this.context.workspaceState.get<Bookmark[]>(
      "file-bookmarks",
      []
    );

    const newBookmark = new Bookmark(label, uri, type);
    storedBookmarks.push(newBookmark);

    await this.context.workspaceState.update("file-bookmarks", storedBookmarks);
    this.refresh();
  };

  removeBookmark = async (bookmark: Bookmark) => {
    const stored_bookmarks = this.context.workspaceState.get<Bookmark[]>(
      "file-bookmarks",
      []
    );

    const output = stored_bookmarks.filter((b) => {
      return !(b.uri === bookmark.uri && b.label === bookmark.label);
    });

    await this.context.workspaceState.update("file-bookmarks", output);
    this.refresh();
  };

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
