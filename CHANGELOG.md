# Changelog

## [0.6.1] - 2025-10-11

### Fixed

- fixed missing conditional for call to DELETE-endpoint for cleanup

## [0.6.0] - 2025-10-11

### Changed

- added show-animation for modals

### Added

- added cli-argument '-h/--help'
- added confirm-dialog when closing the archive-build/download modal before download has started

### Fixed

- fixed archive-build/download modal not calling the DELETE-endpoint for cleanup

## [0.5.0] - 2025-10-09

### Changed

- refactored file-download to supported streamed data
- refactored archive-creation into an asynchronous job and implement proper progress-feedback in client

### Added

- added alternative auth via session-cookie

### Fixed

- removed unused dependencies

## [0.3.0] - 2025-06-26

### Added

- added loading state for downloads

## [0.2.1] - 2025-06-16

### Fixed

- fixed python-package metadata

## [0.2.0] - 2025-06-15

### Added

- added 'Refresh'-button to toolbar
- added Toaster-messaging system

## [0.1.0] - 2025-06-15

### Changed

- initial release
