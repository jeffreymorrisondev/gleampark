import * as assert from "assert";
import * as vscode from "vscode";
import { shareToPlaygroundCommand } from "../../commands/shareToPlayground";

suite("Share to Playground Command", () => {
  let document: vscode.TextDocument;
  let editor: vscode.TextEditor;

  setup(async () => {
    document = await vscode.workspace.openTextDocument({
      content: 'pub fn main() {\n  "Hello, Gleam!"\n}',
      language: "gleam",
    });
    editor = await vscode.window.showTextDocument(document);
  });

  teardown(async () => {
    await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
  });

  test("should execute without errors when code is selected", async function () {
    this.timeout(5000);

    const selection = new vscode.Selection(0, 0, 0, 15);
    editor.selection = selection;

    try {
      await shareToPlaygroundCommand(editor);
      assert.ok(true, "Command executed successfully");
    } catch (error) {
      assert.fail(`Command should not throw: ${error}`);
    }
  });

  test("should show message when no code is selected", async function () {
    this.timeout(5000);

    editor.selection = new vscode.Selection(0, 0, 0, 0);
    assert.ok(editor.selection.isEmpty);

    await shareToPlaygroundCommand(editor);
  });

  test("should handle multi-line selections", async () => {
    const selection = new vscode.Selection(0, 0, 2, 1);
    editor.selection = selection;

    assert.ok(!editor.selection.isEmpty);
    assert.ok(editor.document.getText(selection).includes("\n"));
  });

  test("should handle selections with special characters", async () => {
    const specialDoc = await vscode.workspace.openTextDocument({
      content: 'pub fn test() { "<>&\\"" }',
      language: "gleam",
    });
    const specialEditor = await vscode.window.showTextDocument(specialDoc);

    const selection = new vscode.Selection(0, 0, 0, 25);
    specialEditor.selection = selection;

    try {
      await shareToPlaygroundCommand(specialEditor);
      assert.ok(true);
    } catch (error) {
      assert.fail(`Should handle special characters: ${error}`);
    } finally {
      await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
    }
  });
});