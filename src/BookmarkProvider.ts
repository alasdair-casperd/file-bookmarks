import * as vscode from "vscode";
import { Bookmark } from "./Bookmark";
import { BookmarkType } from "./BookmarkType";

export class BookmarkProvider
  implements
    vscode.TreeDataProvider<Bookmark>,
    vscode.TreeDragAndDropController<Bookmark>
{
  constructor(private context: vscode.ExtensionContext) {
    this.loadBookmarks();
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    Bookmark | undefined | void
  > = new vscode.EventEmitter<Bookmark | undefined | void>();

  readonly onDidChangeTreeData: vscode.Event<Bookmark | undefined | void> =
    this._onDidChangeTreeData.event;

  /**
   * The current list of bookmarks.
   */
  private bookmarks: Bookmark[] = [];

  /**
   * Get the tree item for a given element.
   * @param element
   * @returns
   */
  getTreeItem = (element: Bookmark): vscode.TreeItem => element;

  /**
   * Get the children of an element in the tree. Non-empty for the root element only.
   * @param element
   * @returns
   */
  getChildren = async (element?: Bookmark): Promise<Bookmark[]> => {
    return element ? [] : this.bookmarks;
  };

  /**
   * Load bookmarks from workspace state.
   */
  loadBookmarks = async () => {
    const stored_bookmarks = this.context.workspaceState.get<Bookmark[]>(
      "file-bookmarks",
      []
    );

    if (stored_bookmarks) {
      this.bookmarks = stored_bookmarks.map(
        (bookmark) =>
          new Bookmark(
            bookmark.label,
            bookmark.uri,
            bookmark.type,
            bookmark.version
          )
      );
    }
  };

  /**
   * Save the current list of bookmarks to the workspace state.
   */
  private async saveBookmarks() {
    await this.context.workspaceState.update("file-bookmarks", this.bookmarks);
  }

  /**
   * Bookmark a file or a folder.
   * @param label
   * @param path
   * @param type
   */
  public addBookmark = async (
    label: string,
    uri: vscode.Uri,
    type: BookmarkType
  ) => {
    const new_bookmark = new Bookmark(
      label,
      uri,
      type,
      this.context.extension.packageJSON.version
    );
    this.bookmarks.push(new_bookmark);
    await this.saveBookmarks();
    this.refresh();
  };

  /**
   * Remove a bookmark.
   * @param bookmark
   */
  public removeBookmark = async (bookmark: Bookmark) => {
    this.bookmarks = this.bookmarks.filter((b) => {
      return !(b.uri === bookmark.uri && b.label === bookmark.label);
    });
    await this.saveBookmarks();
    this.refresh();
  };

  /**
   * Refresh the tree view.
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /// Drag and drop support
  dropMimeTypes = ["application/vnd.code.tree.bookmarksView"];
  dragMimeTypes = ["application/vnd.code.tree.bookmarksView"];

  /**
   * Drag-and-drop drag handling.
   * @param source
   * @param dataTransfer
   * @param token
   */
  async handleDrag(
    source: Bookmark[],
    dataTransfer: vscode.DataTransfer,
    token: vscode.CancellationToken
  ) {
    dataTransfer.set(
      "application/vnd.code.tree.bookmarkView",
      new vscode.DataTransferItem(source.map((b) => b.label))
    );
  }

  /**
   * Drag-and-drop drop handling.
   * @param target
   * @param data_transfer
   * @param token
   * @returns
   */
  async handleDrop(
    target: Bookmark | undefined,
    data_transfer: vscode.DataTransfer,
    token: vscode.CancellationToken
  ) {
    const dropped_items = data_transfer.get(
      "application/vnd.code.tree.bookmarkView"
    );
    if (!dropped_items) return;

    const labels = dropped_items.value as string[];
    const dragged_bookmarks = labels
      .map((label) => this.bookmarks.find((b) => b.label === label))
      .filter(Boolean) as Bookmark[];

    // Reorder the bookmarks list
    if (target) {
      const target_index = this.bookmarks.findIndex(
        (b) => b.label === target.label
      );
      this.bookmarks = this.bookmarks.filter((b) => !labels.includes(b.label)); // Remove dragged items first
      this.bookmarks.splice(target_index, 0, ...dragged_bookmarks); // Insert at target position
    } else {
      // Drop at the end
      this.bookmarks = [
        ...this.bookmarks.filter((b) => !labels.includes(b.label)),
        ...dragged_bookmarks,
      ];
    }

    await this.saveBookmarks();
    this.refresh();
  }
}
