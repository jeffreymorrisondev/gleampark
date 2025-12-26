import * as vscode from "vscode";
import {
  validatePlaygroundUrl,
  extractHashFromUrl,
  decodePlaygroundHash,
} from "../utils/playgroundUrl";
import { getPasteMethod } from "../utils/config";
import { PasteMethod } from "../types";

export async function decodeFromPlaygroundCommand(): Promise<void> {
  // 1. Prompt for URL
  const url = await vscode.window.showInputBox({
    prompt: "Enter Gleam Playground URL",
    placeHolder: "https://playground.gleam.run/#...",
    validateInput: (value) => {
      if (!value) {
        return "URL cannot be empty";
      }
      if (!validatePlaygroundUrl(value)) {
        return "Invalid playground URL format";
      }
      return null;
    },
  });

  if (!url) {
    return;
  }

  const hash = extractHashFromUrl(url);
  if (!hash) {
    vscode.window.showErrorMessage("Could not extract hash from URL");
    return;
  }

  const data = decodePlaygroundHash(hash);
  if (!data) {
    vscode.window.showErrorMessage(
      "Could not decode playground data. The URL may be invalid or corrupted."
    );
    return;
  }

  const pasteMethod = getPasteMethod();
  const activeEditor = vscode.window.activeTextEditor;

  let finalMethod: PasteMethod;
  if (!activeEditor) {
    finalMethod = "newFile";
  } else if (pasteMethod === "ask") {
    // Ask user what to do
    const choice = await vscode.window.showQuickPick(
      [
        { label: "New File", value: "newFile" as PasteMethod },
        { label: "Append to Current File", value: "append" as PasteMethod },
      ],
      { placeHolder: "How would you like to insert the code?" }
    );
    if (!choice) {
      return;
    }
    finalMethod = choice.value;
  } else {
    finalMethod = pasteMethod;
  }

  try {
    if (finalMethod === "newFile") {
      await createNewFileWithContent(data.content);
    } else {
      await appendToActiveEditor(data.content, activeEditor!);
    }
    vscode.window.showInformationMessage(
      "Playground code inserted successfully"
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to insert code: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

async function createNewFileWithContent(content: string): Promise<void> {
  const doc = await vscode.workspace.openTextDocument({
    content,
    language: "gleam",
  });

  await vscode.window.showTextDocument(doc);
}

async function appendToActiveEditor(
  content: string,
  editor: vscode.TextEditor
): Promise<void> {
  const document = editor.document;
  const lastLine = document.lineAt(document.lineCount - 1);
  const position = lastLine.range.end;

  await editor.edit((editBuilder) => {
    const separator = document.getText().length > 0 ? "\n\n" : "";
    editBuilder.insert(position, separator + content);
  });

  const newPosition = document.positionAt(
    document.offsetAt(position) + (document.getText().length > 0 ? 2 : 0)
  );
  editor.selection = new vscode.Selection(newPosition, newPosition);
  editor.revealRange(new vscode.Range(newPosition, newPosition));
}
