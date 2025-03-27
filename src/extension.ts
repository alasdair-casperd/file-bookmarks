import * as vscode from "vscode";
import { BookmarkProvider } from "./BookmarkProvider";

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  // Register the bookmark TreeDataProvider
  vscode.window.registerTreeDataProvider(
    "bookmarks",
    new BookmarkProvider(rootPath)
  );
}

export function deactivate() {}
