/**
 * Shared type definitions for the GleamPark extension.
 */

/**
 * Methods for sharing playground links.
 * - clipboard: Copy link to clipboard only
 * - browser: Open link in browser only
 * - both: Copy to clipboard and open in browser
 */
export type ShareMethod = "clipboard" | "browser" | "both";

/**
 * Methods for pasting decoded playground code.
 * - newFile: Always create a new untitled file
 * - append: Append to the end of the active editor
 * - ask: Prompt user to choose each time
 */
export type PasteMethod = "newFile" | "append" | "ask";

/**
 * Structure of decoded playground data.
 * This matches the format used by: playground.gleam.run.
 */
export interface PlaygroundData {
  version: number;
  content: string;
}

/**
 * Command identifiers for the extension.
 */
export const enum GleamParkCommands {
  ShareToPlayground = "gleampark.shareToPlayground",
  DecodeFromPlayground = "gleampark.decodeFromPlayground",
}