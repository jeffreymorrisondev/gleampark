import * as lz from "lz-string";
import { PlaygroundData } from "../types";

/**
 * Base URL for the Gleam Playground.
 */
const PLAYGROUND_BASE_URL = "https://playground.gleam.run";

/**
 * Regular expression to validate and extract hash from playground URLs.
 * Matches: https://playground.gleam.run/#{hash}
 * Captures the hash portion (Base64 characters, per lz-string algo)
 */
const PLAYGROUND_URL_REGEX =
  /^https:\/\/playground\.gleam\.run\/#([A-Za-z0-9+/=_-]+)$/;

/**
 * Builds a complete playground URL from Gleam code.
 *
 * @param code - The Gleam code to encode
 * @returns A complete playground URL with encoded code
 */
export function buildPlaygroundUrl(code: string): string {
  const hash = computePlaygroundHash(code);
  return `${PLAYGROUND_BASE_URL}/#${hash}`;
}

/**
 * Computes the hash portion of a playground URL from Gleam code.
 * Uses LZ-string compression and Base64 encoding.
 *
 * @param code - The Gleam code to encode
 * @returns The compressed and encoded hash
 */
export function computePlaygroundHash(code: string): string {
  return lz.compressToBase64(
    JSON.stringify({
      version: 1,
      content: code,
    })
  );
}

/**
 * Validates that a string is a properly formatted playground URL.
 *
 * @param url - The URL to validate
 * @returns True if the URL matches the expected format
 */
export function validatePlaygroundUrl(url: string): boolean {
  return PLAYGROUND_URL_REGEX.test(url);
}

/**
 * Extracts the hash portion from a playground URL.
 *
 * @param url - The playground URL to extract from
 * @returns The hash string, or null if extraction fails
 */
export function extractHashFromUrl(url: string): string | null {
  const match = url.match(PLAYGROUND_URL_REGEX);
  return match ? match[1] : null;
}

/**
 * Decodes a playground hash back into playground data.
 * Decompresses the Base64-encoded LZ-string and parses the JSON.
 *
 * @param hash - The hash string to decode
 * @returns The decoded playground data, or null if decoding fails
 */
export function decodePlaygroundHash(hash: string): PlaygroundData | null {
  try {
    // Decompress the hash
    const decompressed = lz.decompressFromBase64(hash);

    if (!decompressed) {
      return null;
    }

    // Parse the JSON
    const parsed = JSON.parse(decompressed);

    // Validate structure
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.version !== "number" ||
      typeof parsed.content !== "string"
    ) {
      return null;
    }

    return parsed as PlaygroundData;
  } catch (error) {
    // Handle decompression or JSON parsing errors
    return null;
  }
}
