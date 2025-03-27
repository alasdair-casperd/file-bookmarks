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

  // Command to open a bookmarked file
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "bookmarks.openBookmark",
      async (file_path: string, type: BookmarkType) => {
        // Handle files
        if (type === "file") {
          const uri = vscode.Uri.file(file_path);
          const document = await vscode.workspace.openTextDocument(uri);
          await vscode.window.showTextDocument(document);
        }

        // Handle folders
        else {
          vscode.commands.executeCommand(
            "revealInExplorer",
            vscode.Uri.file(file_path)
          );
        }
      }
    )
  );

  // Command to add a new file bookmark
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "bookmarks.bookmarkFile",
      async (uri?: vscode.Uri) => {
        let file_path: string | undefined;

        // If a URI is provided, use it
        if (uri) {
          file_path = uri.fsPath;
        }

        // Otherwise, get the active editor's file path
        else {
          const editor = vscode.window.activeTextEditor;
          if (editor) file_path = editor.document.uri.fsPath;
        }

        if (!file_path) {
          vscode.window.showErrorMessage("No file path found.");
          return;
        }

        // Prompt the user to enter a label
        let label = await vscode.window.showInputBox({
          prompt: "Enter bookmark name",
        });

        if (label === "") label = path.basename(file_path);
        if (label) bookmark_provider.addBookmark(label, file_path, "file");
      }
    )
  );

  // Command to add a new folder bookmark
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "bookmarks.bookmarkFolder",
      async (uri: vscode.Uri) => {
        const file_path = uri.fsPath;

        // Prompt the user to enter a label
        let label = await vscode.window.showInputBox({
          prompt: "Enter bookmark name",
        });

        if (label === "") label = path.basename(file_path);
        if (label) bookmark_provider.addBookmark(label, file_path, "folder");
      }
    )
  );

  // Command to remove a bookmark
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "bookmarks.removeBookmark",
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
