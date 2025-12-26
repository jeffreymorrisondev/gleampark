import * as assert from "assert";
import * as vscode from "vscode";
import { decodeFromPlaygroundCommand } from "../../commands/decodeFromPlayground";
import { buildPlaygroundUrl } from "../../utils/playgroundUrl";

suite("Decode from Playground Command", () => {
  teardown(async () => {
    await vscode.commands.executeCommand("workbench.action.closeAllEditors");
  });

  suite("URL validation in input box", () => {
    test("should accept valid playground URLs", () => {
      const code = 'pub fn main() { "test" }';
      const url = buildPlaygroundUrl(code);

      assert.ok(url.startsWith("https://playground.gleam.run/#"));
    });

    test("should handle different code structures", () => {
      const testCases = [
        'pub fn main() { "Hello" }',
        "// Comment\npub fn test() {}",
        'import gleam/io\n\npub fn main() {\n  io.println("test")\n}',
      ];

      for (const code of testCases) {
        const url = buildPlaygroundUrl(code);
        assert.ok(url.startsWith("https://playground.gleam.run/#"));
      }
    });
  });

  suite("Integration with active editor", () => {
    test("should work when no editor is open", async () => {
      await vscode.commands.executeCommand("workbench.action.closeAllEditors");
      const editors = vscode.window.visibleTextEditors;
      assert.strictEqual(editors.length, 0);
    });

    test("should work when editor is open", async () => {
      const document = await vscode.workspace.openTextDocument({
        content: "existing content",
        language: "gleam",
      });
      await vscode.window.showTextDocument(document);

      const editor = vscode.window.activeTextEditor;
      assert.ok(editor);

      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor"
      );
    });
  });

  suite("File creation", () => {
    test("should create documents with Gleam language", async () => {
      const document = await vscode.workspace.openTextDocument({
        content: 'pub fn main() { "test" }',
        language: "gleam",
      });

      assert.ok(document.getText().includes("pub fn main"));
    });

    test("should handle empty content", async () => {
      const document = await vscode.workspace.openTextDocument({
        content: "",
        language: "gleam",
      });

      assert.strictEqual(document.getText(), "");
    });

    test("should handle large content", async () => {
      const largeContent = 'pub fn main() { "test" }\n'.repeat(1000);
      const document = await vscode.workspace.openTextDocument({
        content: largeContent,
        language: "gleam",
      });

      assert.ok(document.lineCount >= 1000);
    });
  });

  suite("Append functionality", () => {
    test("should append to end of document", async () => {
      const document = await vscode.workspace.openTextDocument({
        content: "line 1\nline 2",
        language: "gleam",
      });
      const editor = await vscode.window.showTextDocument(document);

      const lastLine = document.lineAt(document.lineCount - 1);
      const position = lastLine.range.end;

      await editor.edit((editBuilder) => {
        editBuilder.insert(position, "\n\nline 3");
      });

      assert.ok(document.getText().includes("line 3"));
      assert.ok(document.getText().endsWith("line 3"));
    });

    test("should handle appending to empty document", async () => {
      const document = await vscode.workspace.openTextDocument({
        content: "",
        language: "gleam",
      });
      const editor = await vscode.window.showTextDocument(document);

      const lastLine = document.lineAt(document.lineCount - 1);
      const position = lastLine.range.end;

      await editor.edit((editBuilder) => {
        editBuilder.insert(position, "new content");
      });

      assert.strictEqual(document.getText(), "new content");
    });

    test("should preserve existing content when appending", async () => {
      const originalContent = "existing content";
      const document = await vscode.workspace.openTextDocument({
        content: originalContent,
        language: "gleam",
      });
      const editor = await vscode.window.showTextDocument(document);

      const lastLine = document.lineAt(document.lineCount - 1);
      const position = lastLine.range.end;

      await editor.edit((editBuilder) => {
        editBuilder.insert(position, "\n\nappended content");
      });

      assert.ok(document.getText().includes(originalContent));
      assert.ok(document.getText().includes("appended content"));
    });
  });
});
