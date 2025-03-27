import * as vscode from "vscode";
import { Bookmark, BookmarkProvider } from "./BookmarkProvider";
import path from "path";

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  const bookmarkProvider = new BookmarkProvider(context);

  // Bookmarks tree view
  vscode.window.registerTreeDataProvider("bookmarks", bookmarkProvider);

  // Command to open a bookmarked file
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "bookmarks.openBookmark",
      async (file_path) => {
        const uri = vscode.Uri.file(file_path);
        const document = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(document);
      }
    )
  );

  // Command to add a new bookmark
  context.subscriptions.push(
    vscode.commands.registerCommand("bookmarks.addBookmark", async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const file_path = document.uri.path;

        let label = await vscode.window.showInputBox({
          prompt: "Enter bookmark name",
        });

        if (label === "") label = path.basename(file_path);
        if (label) bookmarkProvider.addBookmark(label, file_path);
      } else {
        vscode.window.showErrorMessage("No active editor found.");
      }
    })
  );
}

export function deactivate() {}
