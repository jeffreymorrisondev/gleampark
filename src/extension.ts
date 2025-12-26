import * as vscode from "vscode";
import { shareToPlaygroundCommand } from "./commands/shareToPlayground";
import { decodeFromPlaygroundCommand } from "./commands/decodeFromPlayground";
import { GleamParkCommands } from "./types";

/**
 * Activates the GleamPark extension.
 * Registers all commands and sets up the extension.
 */
export function activate(context: vscode.ExtensionContext): void {
  // Register share to playground command (requires active text editor)
  const shareCommand = vscode.commands.registerTextEditorCommand(
    GleamParkCommands.ShareToPlayground,
    shareToPlaygroundCommand
  );

  // Register decode from playground command (works without active editor)
  const decodeCommand = vscode.commands.registerCommand(
    GleamParkCommands.DecodeFromPlayground,
    decodeFromPlaygroundCommand
  );

  context.subscriptions.push(shareCommand, decodeCommand);
}

/**
 * Deactivates the extension.
 * Called when the extension is deactivated.
 */
export function deactivate(): void {
  return;
}

// Export functions for testing
export {
  buildPlaygroundUrl,
  computePlaygroundHash,
} from "./utils/playgroundUrl";
