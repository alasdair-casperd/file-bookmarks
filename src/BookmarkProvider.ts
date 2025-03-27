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
      "bookmarks",
      []
    );

    return storedBookmarks.map(
      (bookmark) => new Bookmark(bookmark.label, bookmark.path, bookmark.type)
    );
  };

  /**
   * Bookmark a file or a folder.
   * @param label
   * @param path
   * @param type
   */
  addBookmark = async (label: string, path: string, type: BookmarkType) => {
    const storedBookmarks = this.context.workspaceState.get<Bookmark[]>(
      "bookmarks",
      []
    );

    const newBookmark = new Bookmark(label, path, type);
    storedBookmarks.push(newBookmark);

    await this.context.workspaceState.update("bookmarks", storedBookmarks);
    this.refresh();
  };

  removeBookmark = async (bookmark: Bookmark) => {
    const stored_bookmarks = this.context.workspaceState.get<Bookmark[]>(
      "bookmarks",
      []
    );

    const output = stored_bookmarks.filter((b) => {
      return !(b.path === bookmark.path && b.label === bookmark.label);
    });

    await this.context.workspaceState.update("bookmarks", output);
    this.refresh();
  };

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
