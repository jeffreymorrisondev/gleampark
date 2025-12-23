import * as vscode from "vscode";
import * as lz from "lz-string";

const enum GleamParkCommands {
  ShareToPlayground = "gleampark.shareToPlayground",
}

type ShareMethod = "clipboard" | "browser" | "both";

const PLAYGROUND_BASE_URL = "https://playground.gleam.run";

export function activate(context: vscode.ExtensionContext): void {
  // create share command
  const shareToPlaygroundCommand = vscode.commands.registerTextEditorCommand(
    GleamParkCommands.ShareToPlayground,
    async (editor: vscode.TextEditor) => {
      const selection = editor.selection;

      if (selection.isEmpty) {
        vscode.window.showInformationMessage(
          "Please select code to share to the playground."
        );
        return;
      }

      const url = buildPlaygroundUrl(editor.document.getText(selection));

      const shareMethod = vscode.workspace
        .getConfiguration("gleampark")
        .get<ShareMethod>("shareMethod");

      if (shareMethod === "clipboard" || shareMethod === "both") {
        await vscode.env.clipboard.writeText(url);
        vscode.window.showInformationMessage("Playground link copied!");
      }

      if (shareMethod === "browser" || shareMethod === "both") {
        vscode.env.openExternal(vscode.Uri.parse(url));
      }
    }
  );
  // register share command
  context.subscriptions.push(shareToPlaygroundCommand);
}

export function buildPlaygroundUrl(code: string): string {
  const hash = computePlaygroundHash(code);
  return `${PLAYGROUND_BASE_URL}/#${hash}`;
}

export function computePlaygroundHash(code: string): string {
  return lz.compressToBase64(
    JSON.stringify({
      version: 1,
      content: code,
    })
  );
}

export function deactivate(): void {
  return;
}
