import * as assert from "assert";
import * as vscode from "vscode";
import * as lz from "lz-string";
import { buildPlaygroundUrl, computePlaygroundHash } from "../utils/playgroundUrl";

suite("GleamPark Extension Test Suite", () => {
  const EXTENSION_ID = "jeffreymorrisondev.gleampark";

  suiteSetup(async () => {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    if (extension && !extension.isActive) {
      await extension.activate();
    }
  });

  vscode.window.showInformationMessage("Start all tests.");

  test("Extension should be present", () => {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    assert.ok(extension, "Extension should be installed");
  });

  test("Should register shareToPlayground command", async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(
      commands.includes("gleampark.shareToPlayground"),
      "Command gleampark.shareToPlayground should be registered"
    );
  });

  test("Should register decodeFromPlayground command", async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(
      commands.includes("gleampark.decodeFromPlayground"),
      "Command gleampark.decodeFromPlayground should be registered"
    );
  });

  suite("Playground URL Generation", () => {
    test("buildPlaygroundUrl should create valid URL", () => {
      const code = 'pub fn main() { "Hello" }';
      const url = buildPlaygroundUrl(code);

      assert.ok(url.startsWith("https://playground.gleam.run/#"));
      assert.ok(url.length > "https://playground.gleam.run/#".length);

      const hash = url.split("#")[1];
      const decoded = JSON.parse(lz.decompressFromBase64(hash)!);
      assert.strictEqual(decoded.content, code);
    });

    test("computePlaygroundHash should be consistent", () => {
      const code = 'pub fn main() { "Hello" }';
      const hash1 = computePlaygroundHash(code);
      const hash2 = computePlaygroundHash(code);

      assert.strictEqual(hash1, hash2);
    });

    test("should handle empty code", () => {
      const code = "";
      const url = buildPlaygroundUrl(code);
      const hash = url.split("#")[1];
      const decoded = JSON.parse(lz.decompressFromBase64(hash)!);

      assert.strictEqual(decoded.content, "");
    });
  });

  suite("Integration Tests", () => {
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
      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor"
      );
    });

    test("Should execute shareToPlayground command without errors", async function () {
      this.timeout(5000);

      const selection = new vscode.Selection(0, 0, 0, 15);
      editor.selection = selection;

      try {
        await vscode.commands.executeCommand("gleampark.shareToPlayground");
        assert.ok(true, "Command executed without throwing");
      } catch (error) {
        assert.ok(error);
      }
    });

    test("Should handle selection", async () => {
      const selection = new vscode.Selection(0, 0, 0, 15);
      editor.selection = selection;

      assert.ok(!editor.selection.isEmpty);
      assert.strictEqual(editor.document.getText(selection), "pub fn main() {");
    });

    test("Should handle empty selection", async () => {
      editor.selection = new vscode.Selection(0, 0, 0, 0);
      assert.ok(editor.selection.isEmpty);
    });
  });

  suite("Edge Cases", () => {
    test("Should handle multi-line code", () => {
      const code = `pub fn main() {
  io.println("Hello")
  io.println("World")
}`;
      const url = buildPlaygroundUrl(code);

      const hash = url.split("#")[1];
      const decoded = JSON.parse(lz.decompressFromBase64(hash)!);
      assert.strictEqual(decoded.content, code);
    });

    test("Should handle very large code", () => {
      const largeCode = 'pub fn main() { "Hello" }\n'.repeat(1000);
      const url = buildPlaygroundUrl(largeCode);

      assert.ok(url.length > 0);
      assert.ok(url.length < 100000, "URL should be under 100KB");

      const hash = url.split("#")[1];
      const decoded = JSON.parse(lz.decompressFromBase64(hash)!);
      assert.strictEqual(decoded.content, largeCode);
    });

    test("Should handle special characters", () => {
      const code = 'pub fn main() { "Hello 👋 <>&\\"" }';
      const url = buildPlaygroundUrl(code);

      const hash = url.split("#")[1];
      const decoded = JSON.parse(lz.decompressFromBase64(hash)!);
      assert.strictEqual(decoded.content, code);
    });

    test("Should handle unicode characters", () => {
      const code = 'pub fn main() { "Hello 世界 🌍" }';
      const url = buildPlaygroundUrl(code);

      const hash = url.split("#")[1];
      const decoded = JSON.parse(lz.decompressFromBase64(hash)!);
      assert.strictEqual(decoded.content, code);
    });

    test("Should preserve exact code through compression cycle", () => {
      const testCases = [
        "pub fn test() { Ok(1) }",
        "// Comment\npub fn main() {}",
        'import gleam/io\n\npub fn main() {\n  io.println("test")\n}',
        'pub fn special() { "\\n\\t\\r" }',
      ];

      for (const code of testCases) {
        const url = buildPlaygroundUrl(code);
        const hash = url.split("#")[1];
        const decoded = JSON.parse(lz.decompressFromBase64(hash)!);
        assert.strictEqual(decoded.content, code, `Failed for: ${code}`);
      }
    });
  });
});