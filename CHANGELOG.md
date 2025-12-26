# Change Log

All notable changes to the "gleampark" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

- Configuration: `gleampark.noSelectionBehavior` - Control behavior when no code is selected
  - `ask` - Prompt user to choose (default)
  - `nothing` - Show message and do nothing
  - `wholeFile` - Automatically share entire file

## [0.1.0] - 2025-12-26

### Added

- Command: `gleampark.decodeFromPlayground` - Decode Gleam Playground URLs and insert code into editor
- Configuration: `gleampark.pasteMethod` - Control how decoded code is inserted
  - `newFile` - Create new untitled file (default)
  - `append` - Append to end of active editor
  - `ask` - Prompt user each time

### Changed

- Refactored codebase into modular structure (commands, utils, types)
- Improved error handling for URL encoding/decoding

## [0.0.1] - 2025-12-22

### Added

- Initial release of Gleam Park
- Share Gleam code to [playground.gleam.run](https://playground.gleam.run)
- Support for selections - share only selected code when text is highlighted
- Command: `gleampark.shareToPlayground` - Share selected code or entire file to playground
- Configuration: `gleampark.shareMethod` - Choose how to share playground links
  - `browser` - Open link in browser (default)
  - `both` - Copy to clipboard and open in browser
  - `clipboard` - Copy link to clipboard
- Automatic code compression using LZ-string for compact URLs
- Test suite - passing back as far as 1.75.0
