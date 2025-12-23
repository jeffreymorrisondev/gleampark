# Gleam Park

Share your Gleam code to [playground.gleam.run](https://playground.gleam.run) directly from VS Code.

## Features

- **Quick sharing** - Share code to the Gleam Playground with a single command
- **Configurable sharing** - Copy link to clipboard, open in browser, or both

## Installation

### From VS Code Marketplace

Search for "Gleam Park" in the Extensions view

### Manual Installation

Download the latest `.vsix` file from [Releases](https://github.com/jeffreymorrisondev/gleampark/releases) and install via:

- VS Code: Extensions view → `...` → Install from VSIX
- Command line: `code --install-extension gleampark-0.0.1.vsix`

## Usage

### Command Palette

1. Open a Gleam file
2. Highlight the Gleam code you want to share via Gleam Playground
3. Open the Command Palette (`Cmd+Shift+P` on macOS or `Ctrl+Shift+P` on Windows/Linux)
4. Run `GleamPark: Share to Playground`

## Extension Settings

This extension contributes the following settings:

- `gleampark.shareMethod`: Choose how to share playground links
  - `browser` - Open link in browser only (default)
  - `both` - Copy to clipboard and open in browser
  - `clipboard` - Copy link to clipboard only

## Requirements

- VS Code 1.70.0 or higher

## Known Issues

None at this time. Please [report issues](https://github.com/jeffreymorrisondev/gleampark/issues) on GitHub.

## Release Notes

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
