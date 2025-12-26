# Gleam Park

Share your Gleam code to [playground.gleam.run](https://playground.gleam.run) directly from VS Code.

## Features

- **Quick sharing** - Share code to the Gleam Playground with a single command
- **Decode playground links** - Import code from playground URLs back into your editor
- **Configurable sharing** - Copy link to clipboard, open in browser, or both
- **Flexible pasting** - Choose how decoded code is inserted (new file, append, or ask)

## Installation

### Manual Installation

Download the latest `.vsix` file from [Releases](https://github.com/jeffreymorrisondev/gleampark/releases) and install via:

- VS Code: Extensions view → `...` → Install from VSIX
- Command line: `code --install-extension gleampark-0.0.1.vsix`

## Usage

### Share to Playground

1. Open a Gleam file
2. Highlight the Gleam code you want to share
3. Open the Command Palette (`Cmd+Shift+P` on macOS or `Ctrl+Shift+P` on Windows/Linux)
4. Run `GleamPark: Share to Playground`

### Decode from Playground

1. Copy a Gleam Playground URL
2. Open the Command Palette (`Cmd+Shift+P` on macOS or `Ctrl+Shift+P` on Windows/Linux)
3. Run `GleamPark: Decode from Playground`
4. Paste the URL when prompted
5. Code will be inserted according to your configured paste method

## Extension Settings

This extension contributes the following settings:

- `gleampark.shareMethod`: Choose how to share playground links
  - `browser` - Open link in browser only (default)
  - `both` - Copy to clipboard and open in browser
  - `clipboard` - Copy link to clipboard only

- `gleampark.pasteMethod`: Choose how to handle decoded playground code
  - `newFile` - Always open in a new untitled file (default)
  - `append` - Append to end of active editor
  - `ask` - Ask user each time

## Requirements

- VS Code 1.70.0 or higher

## Known Issues

None at this time. Please [report issues](https://github.com/jeffreymorrisondev/gleampark/issues) on GitHub.

## Release Notes

### 0.1.0

- Added decode from playground feature
- Added configurable paste methods for decoded code
- Refactored codebase for better maintainability
- Improved error handling

### 0.0.1

Initial release of Gleam Park

- Share Gleam code to playground.gleam.run
- Configurable share methods (clipboard, browser, or both)
- Support for sharing selections or entire files

---

## Links

- [Gleam Language](https://gleam.run)
- [Gleam Playground](https://playground.gleam.run)
- [Report Issues](https://github.com/jeffreymorrisondev/gleampark/issues)
- [Source Code](https://github.com/jeffreymorrisondev/gleampark)
