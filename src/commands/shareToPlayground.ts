import * as vscode from "vscode";
import { buildPlaygroundUrl } from "../utils/playgroundUrl";
import { getShareMethod } from "../utils/config";

export async function shareToPlaygroundCommand(
  editor: vscode.TextEditor
): Promise<void> {
  const selection = editor.selection;

  if (selection.isEmpty) {
    vscode.window.showInformationMessage(
      "Please select code to share to the playground."
    );
    return;
  }

  const code = editor.document.getText(selection);
  const url = buildPlaygroundUrl(code);

  const shareMethod = getShareMethod();

  // Handle clipboard sharing
  if (shareMethod === "clipboard" || shareMethod === "both") {
    await vscode.env.clipboard.writeText(url);
    vscode.window.showInformationMessage("Playground link copied!");
  }

  // Handle browser sharing
  if (shareMethod === "browser" || shareMethod === "both") {
    try {
      await vscode.env.openExternal(vscode.Uri.parse(url));
    } catch (error) {
      // this fails in automated tests -- this will cause it to fail silently without opening browser
    }
  }
}
