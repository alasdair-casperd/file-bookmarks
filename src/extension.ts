import * as vscode from "vscode";
import { Bookmark, BookmarkProvider } from "./BookmarkProvider";

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  // Bookmarks tree view
  vscode.window.registerTreeDataProvider(
    "bookmarks",
    new BookmarkProvider(rootPath)
  );

  // Command to open a bookmarked file
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "bookmarks.openBookmark",
      async (bookmark: Bookmark) => {
        const uri = vscode.Uri.file(bookmark.file_path);
        const document = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(document);
      }
    )
  );
}

export function deactivate() {}
