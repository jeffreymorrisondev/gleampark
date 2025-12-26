import * as vscode from "vscode";
import { ShareMethod, PasteMethod } from "../types";

const CONFIG_SECTION = "gleampark";

export function getShareMethod(): ShareMethod {
  const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
  return config.get<ShareMethod>("shareMethod")!; // default value is defined in the config
}

/**
 * Gets the configured paste method for decoded playground code.
 * Defaults to "newFile" if not configured.
 *
 * @returns The configured paste method
 */
export function getPasteMethod(): PasteMethod {
  const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
  return config.get<PasteMethod>("pasteMethod")!;
}
