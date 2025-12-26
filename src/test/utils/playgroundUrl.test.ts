import * as assert from "assert";
import * as lz from "lz-string";
import {
  buildPlaygroundUrl,
  computePlaygroundHash,
  validatePlaygroundUrl,
  extractHashFromUrl,
  decodePlaygroundHash,
} from "../../utils/playgroundUrl";

suite("Playground URL Utils", () => {
  suite("buildPlaygroundUrl", () => {
    test("should create valid URL with encoded code", () => {
      const code = 'pub fn main() { "Hello" }';
      const url = buildPlaygroundUrl(code);

      assert.ok(url.startsWith("https://playground.gleam.run/#"));
      assert.ok(url.length > "https://playground.gleam.run/#".length);
    });

    test("should create URL that can be decoded back", () => {
      const code = 'pub fn main() { "Hello" }';
      const url = buildPlaygroundUrl(code);
      const hash = url.split("#")[1];
      const decoded = JSON.parse(lz.decompressFromBase64(hash)!);

      assert.strictEqual(decoded.content, code);
      assert.strictEqual(decoded.version, 1);
    });
  });

  suite("computePlaygroundHash", () => {
    test("should create valid base64 hash", () => {
      const code = 'pub fn main() { "Hello" }';
      const hash = computePlaygroundHash(code);

      assert.ok(hash.length > 0);
      assert.ok(/^[A-Za-z0-9+/=]+$/.test(hash));
    });

    test("should create consistent hashes for same code", () => {
      const code = 'pub fn main() { "Hello" }';
      const hash1 = computePlaygroundHash(code);
      const hash2 = computePlaygroundHash(code);

      assert.strictEqual(hash1, hash2);
    });

    test("should create different hashes for different code", () => {
      const code1 = 'pub fn main() { "Hello" }';
      const code2 = 'pub fn main() { "World" }';
      const hash1 = computePlaygroundHash(code1);
      const hash2 = computePlaygroundHash(code2);

      assert.notStrictEqual(hash1, hash2);
    });
  });

  suite("validatePlaygroundUrl", () => {
    test("should validate correct playground URLs", () => {
      const validUrls = [
        "https://playground.gleam.run/#N4Ig",
        "https://playground.gleam.run/#N4IgbghgJgLgFgAgNYGMD2AXGBrSBPAHgBsQBXAOwGcCAaEAbQF0A",
        "https://playground.gleam.run/#ABC123+/=",
        "https://playground.gleam.run/#N4IgbghgJg_-LgFgAgNYGMD2AXGBrSBPAHgBsQBXAOwGcCAaEAbQF0A",
      ];

      for (const url of validUrls) {
        assert.ok(
          validatePlaygroundUrl(url),
          `Should validate: ${url}`
        );
      }
    });

    test("should reject invalid URLs", () => {
      const invalidUrls = [
        "https://example.com/#hash",
        "http://playground.gleam.run/#hash",
        "https://playground.gleam.run/",
        "https://playground.gleam.run/#",
        "playground.gleam.run/#hash",
        "https://playground.gleam.run/#hash with spaces",
        "",
        "not a url",
      ];

      for (const url of invalidUrls) {
        assert.ok(
          !validatePlaygroundUrl(url),
          `Should reject: ${url}`
        );
      }
    });
  });

  suite("extractHashFromUrl", () => {
    test("should extract hash from valid URL", () => {
      const hash = "N4IgbghgJgLgFgAgNYGMD2AXGBrSBPAHgBsQBXAOwGcCAaEAbQF0A";
      const url = `https://playground.gleam.run/#${hash}`;
      const extracted = extractHashFromUrl(url);

      assert.strictEqual(extracted, hash);
    });

    test("should return null for invalid URLs", () => {
      const invalidUrls = [
        "https://example.com/#hash",
        "not a url",
        "",
        "https://playground.gleam.run/",
      ];

      for (const url of invalidUrls) {
        assert.strictEqual(extractHashFromUrl(url), null);
      }
    });

    test("should handle URL-safe base64 characters", () => {
      const hash = "ABC_-123+/=";
      const url = `https://playground.gleam.run/#${hash}`;
      const extracted = extractHashFromUrl(url);

      assert.strictEqual(extracted, hash);
    });
  });

  suite("decodePlaygroundHash", () => {
    test("should decode valid hash", () => {
      const code = 'pub fn main() { "Hello" }';
      const hash = computePlaygroundHash(code);
      const decoded = decodePlaygroundHash(hash);

      assert.ok(decoded);
      assert.strictEqual(decoded.content, code);
      assert.strictEqual(decoded.version, 1);
    });

    test("should return null for invalid hash", () => {
      const invalidHashes = [
        "invalid",
        "!@#$%^&*()",
        "",
        "A",
      ];

      for (const hash of invalidHashes) {
        assert.strictEqual(decodePlaygroundHash(hash), null);
      }
    });

    test("should return null for valid base64 but invalid JSON", () => {
      const validBase64InvalidJson = lz.compressToBase64("not json");
      assert.strictEqual(decodePlaygroundHash(validBase64InvalidJson), null);
    });

    test("should return null for valid JSON but wrong structure", () => {
      const wrongStructures = [
        { wrong: "structure" },
        { version: "not a number", content: "test" },
        { version: 1, content: 123 },
        { version: 1 },
        { content: "test" },
      ];

      for (const obj of wrongStructures) {
        const hash = lz.compressToBase64(JSON.stringify(obj));
        assert.strictEqual(decodePlaygroundHash(hash), null);
      }
    });

    test("should handle unicode characters", () => {
      const code = 'pub fn main() { "Hello 世界 🌍" }';
      const hash = computePlaygroundHash(code);
      const decoded = decodePlaygroundHash(hash);

      assert.ok(decoded);
      assert.strictEqual(decoded.content, code);
    });

    test("should handle multi-line code", () => {
      const code = `pub fn main() {
  io.println("Hello")
  io.println("World")
}`;
      const hash = computePlaygroundHash(code);
      const decoded = decodePlaygroundHash(hash);

      assert.ok(decoded);
      assert.strictEqual(decoded.content, code);
    });

    test("should handle special characters", () => {
      const code = 'pub fn main() { "Hello <>&\\"" }';
      const hash = computePlaygroundHash(code);
      const decoded = decodePlaygroundHash(hash);

      assert.ok(decoded);
      assert.strictEqual(decoded.content, code);
    });

    test("should handle very large code", () => {
      const largeCode = 'pub fn main() { "Hello" }\n'.repeat(1000);
      const hash = computePlaygroundHash(largeCode);
      const decoded = decodePlaygroundHash(hash);

      assert.ok(decoded);
      assert.strictEqual(decoded.content, largeCode);
    });
  });

  suite("encode-decode round-trip", () => {
    test("should preserve code through full cycle", () => {
      const testCases = [
        "pub fn test() { Ok(1) }",
        "// Comment\npub fn main() {}",
        'import gleam/io\n\npub fn main() {\n  io.println("test")\n}',
        'pub fn special() { "\\n\\t\\r" }',
        'pub fn unicode() { "世界 🌍" }',
        "",
        " ",
        "a".repeat(10000),
      ];

      for (const code of testCases) {
        const url = buildPlaygroundUrl(code);
        const hash = extractHashFromUrl(url);
        assert.ok(hash, `Failed to extract hash for: ${code.substring(0, 50)}`);

        const decoded = decodePlaygroundHash(hash!);
        assert.ok(decoded, `Failed to decode for: ${code.substring(0, 50)}`);
        assert.strictEqual(
          decoded.content,
          code,
          `Code mismatch for: ${code.substring(0, 50)}`
        );
      }
    });
  });
});