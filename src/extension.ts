import * as vscode from "vscode";
import { BookmarkProvider } from "./BookmarkProvider";
import path from "path";
import { Bookmark } from "./Bookmark";
import { BookmarkType } from "./BookmarkType";

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  const bookmark_provider = new BookmarkProvider(context);

  // Bookmarks tree view
  vscode.window.registerTreeDataProvider("bookmarksView", bookmark_provider);
  vscode.window.createTreeView("bookmarksView", {
    treeDataProvider: bookmark_provider,
    dragAndDropController: bookmark_provider,
  });

  // Command to open a bookmarked file
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "file-bookmarks.openBookmark",
      async (uri: vscode.Uri, type: BookmarkType) => {
        // Handle files
        if (type === "file") {
          const reloaded_uri = vscode.Uri.file(uri.fsPath);
          const document = await vscode.workspace.openTextDocument(
            reloaded_uri
          );
          await vscode.window.showTextDocument(reloaded_uri);
        }

        // Handle folders
        else {
          vscode.commands.executeCommand("revealInExplorer", uri);
        }
      }
    )
  );

  // Command to add a new file bookmark
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "file-bookmarks.bookmarkFile",
      async (uri?: vscode.Uri) => {
        // If no uri is provided, use the currently active file
        if (!uri) {
          const editor = vscode.window.activeTextEditor;
          if (editor) uri = editor.document.uri;
        }

        if (!uri) {
          vscode.window.showErrorMessage("No selected file was found.");
          return;
        }

        // Prompt the user to enter a label
        let label = await vscode.window.showInputBox({
          prompt: "Enter bookmark name",
        });

        if (label === "") label = path.basename(uri.path);
        if (label) bookmark_provider.addBookmark(label, uri, "file");
      }
    )
  );

  // Command to add a new folder bookmark
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "file-bookmarks.bookmarkFolder",
      async (uri: vscode.Uri) => {
        // Prompt the user to enter a label
        let label = await vscode.window.showInputBox({
          prompt: "Enter bookmark name",
        });

        if (label === "") label = path.basename(uri.path);
        if (label) bookmark_provider.addBookmark(label, uri, "folder");
      }
    )
  );

  // Command to remove a bookmark
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "file-bookmarks.removeBookmark",
      async (bookmark: Bookmark) => {
        if (!bookmark) {
          vscode.window.showErrorMessage("No bookmark selected.");
          return;
        }

        bookmark_provider.removeBookmark(bookmark);
      }
    )
  );
}

export function deactivate() {}
