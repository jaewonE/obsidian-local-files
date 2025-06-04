# Local Images for Obsidian

![Obsidian Version](https://img.shields.io/badge/Obsidian-1.0%2B-blue.svg) ![Release Date](https://img.shields.io/badge/Released-May%2028%2C%202025-green.svg) ![License](https://img.shields.io/badge/License-GPL--3.0-blue.svg)

![demo](https://github.com/jaewonE/obsidian-local-files/blob/master/assets/demo.gif?raw=true)

**Automatically downloads external images in your notes to your local vault, ensuring your visual content remains accessible, future-proof, and accurately identified.**

---

## Overview

The **Local Images** plugin for Obsidian is designed to improve the persistence and reliability of image assets within your notes. It identifies externally linked (HTTP/HTTPS) images in the active note, downloads them to a designated local folder in your vault, and updates the corresponding links to these local copies. This version introduces enhanced image verification by checking file metadata (size, dimensions, hash) to ensure that even if an image URL is reused for different content, the plugin correctly identifies and handles the change.

**Key Motivations:**

-   **Content Persistence**: Safeguards your notes against broken image links that can occur due to loss of internet connectivity or when source websites become unavailable. This ensures visual information remains an integral part of your notes.
-   **Accurate Image Handling**: Prevents issues where an image at the same URL might have changed. By verifying image metadata, the plugin ensures you're linking to the correct version of the image.
-   **Modernized Implementation**: Utilizes the current Obsidian API (0.15+) and contemporary development practices. This plugin offers a stable and compatible solution, serving as a modern alternative to older plugins with similar functionalities.

This plugin provides a focused tool for automating image asset management, intended to be particularly useful for active Obsidian users.

---

## Key Features

-   **External Image Detection**:
    -   Scans the active Markdown note or HTML content blocks for external image URLs using regular expressions (`mdImageRegex`, `htmlImageRegex`).
-   **Automatic Downloads**:
    -   Downloads images and stores them as binary files within a user-specified subfolder in your vault (default: `assets/images`).
    -   Automatically creates the target folder if it does not exist (via `vault.createBinary()`).
-   **Automatic Link Conversion**:
    -   Updates the image links in your note to use local relative or absolute paths immediately after download (via `fileManager.generateMarkdownLink()`).
-   **Enhanced Duplicate File Handling**:
    -   Offers three strategies for managing files that already exist or have been previously downloaded:
        -   `Rename`: Appends an incrementing suffix to new files (e.g., `image_1.png`, `image_2.png`).
        -   `Overwrite`: Replaces the existing file with the newly downloaded one.
        -   `Skip`: Avoids downloading the image if a file with the same name (or from the same URL) already exists **and** is verified to be the exact same image by comparing its metadata (size, dimensions, and content hash). This ensures that if remote image content changes but the URL doesn't, the new image is downloaded.
    -   Includes logic to re-download previously skipped or deleted files, with checks for actual file presence and metadata verification.
-   **Image Metadata Tracking**:
    -   For each downloaded image, metadata (original URL, local file path, size, dimensions, and a content hash) is stored in a `data.json` file. This enables more accurate identification and management of images.
-   **Customizable Filename Templating**:
    -   Allows user-defined naming conventions for downloaded images using placeholders:
        -   `{imageName}`: The original filename of the image.
        -   `{noteName}`: The name of the note containing the image.
        -   `{timestamp}`: The download timestamp.
        -   `{randomString}`: A short random string for uniqueness.
-   **User Settings UI**:
    -   Configure the plugin via the Obsidian settings panel (`LocalImagesSettingTab`):
        -   Target image folder.
        -   Filename template.
        -   Notification preferences.
        -   Duplicate file handling strategy.
        -   Toggle for using relative or absolute paths.
-   **Execution Interface**:
    -   **Ribbon Icon**: A ribbon icon is available to process the current note.
    -   **Command Palette**: The command "Local Images: Download external images in current note" (`download-images-current-note`) can be used to trigger image downloads.
-   **Feedback & Notifications**:
    -   Provides notifications regarding the download process:
        -   Number of images successfully downloaded or failed.
        -   Specific error messages.
        -   Confirmation of folder creation (uses Obsidian's `Notice API`).

---

## How to Use

1.  Open a note containing externally linked images (e.g., `![](https://example.com/image.png)`).
2.  Trigger the download process using one of these methods:
    -   Click the **Local Images icon** in the Obsidian ribbon.
    -   Open the **Command Palette** (Ctrl/Cmd + P), search for "Local Images: Download external images in current note", and select it.
3.  The plugin will scan the note, download images to the configured local folder, verify their content against any previously downloaded versions from the same URL using metadata, and update the links.
4.  Notifications will indicate the outcome of the process.

---

## Configuration Settings

Access these settings via **Obsidian Settings → Local Images**:

-   **Image Folder Path**:
    -   The default folder within your vault for saving images.
    -   _Default_: `assets/images`
-   **Filename Template**:
    -   Defines the naming pattern for downloaded image files using available placeholders.
    -   _Default_: `{imageName}`
-   **Duplicate File Strategy**:
    -   Determines how to handle files that already exist: `Rename`, `Overwrite`, or `Skip`.
    -   The `Skip` strategy now uses comprehensive metadata comparison (size, dimensions, hash) for enhanced accuracy.
    -   _Default_: `Rename`
-   **Process Existing Local Images**:
    -   If enabled, allows reprocessing of previously downloaded images (e.g., to apply a new filename template or move to a new folder). This interacts with the metadata verification; if an image marked as "skipped" based on URL is found to have different content, it may be re-downloaded/reprocessed.
-   **Use Relative Paths**:
    -   Toggles between relative (e.g., `../assets/images/image.png`) or absolute (e.g., `/assets/images/image.png`) paths for updated image links.
    -   _Default_: Enabled (Relative paths)
-   **Show Notifications**:
    -   Enables or disables notifications for download events.
    -   _Default_: Enabled

---

## Technical Details & Architecture

-   **Language**: Developed with **TypeScript** (compiled in `strict` mode).
-   **Obsidian API**: Utilizes core Obsidian Plugin API components such as `Plugin`, `requestUrl`, `Vault`, `FileManager`, and `WorkspaceLeaf`.
-   **Data Management**: A `data.json` file within the plugin's configuration directory stores metadata for downloaded images. Each entry, keyed by the original image URL, contains the local `filePath`, `size`, `width`, `height`, and a SHA-256 `hash` of the image content.
-   **Image Verification Logic**: Functions `analyzeImage` (to generate metadata for a file) and `isSameImage` (to compare metadata of a stored image against a new file) are used. These typically reside in a utility module (e.g., `utils.ts` or a dedicated image processing module).
-   **Bundling**: Uses **esbuild** for efficient bundling into a single `main.js` file. Development mode includes watching, while production mode enables minification. Electron and Node.js built-in modules are excluded to reduce bundle size.
-   **Asynchronous Batch Processing**: Employs asynchronous processing for concurrent image downloads to maintain UI responsiveness, even with numerous images.
-   **Typing & Linting**: Uses `strict` TypeScript compilation and ESLint (`@typescript-eslint`) rules to help identify potential runtime errors during development.
-   **Layered Architecture**: The codebase is structured into distinct modules within the `src/` directory for maintainability:
    -   `main.ts`: Manages plugin lifecycle and UI registration.
    -   `contentProcessor.ts`: Contains logic for content parsing, image downloading, and link replacement.
    -   `config.ts`: Handles settings, default values, and interaction with `data.json`.
    -   `utils.ts`: Provides utility functions for URL validation, filename sanitization, and potentially the image metadata analysis and comparison logic (`analyzeImage`, `isSameImage`).

---

## Future Enhancements

Potential areas for future development include:

-   **Image Post-processing**: Optional features for image conversion (e.g., to WebP) or optimization during download.
-   **Data URI Support**: Functionality to detect and convert `data:` scheme images (Base64 encoded) into local files.
-   **Batch Processing for Multiple Notes**: A command to scan and process all notes in the vault or a selected folder.
-   **Progress Indication**: For large operations, a more detailed progress indicator in the UI.
-   **Migration for `data.json`**: As this is a development stage, no migration for older `data.json` formats is currently implemented.

---

## License

This plugin is released under the **GNU General Public License v3.0**. Refer to the [LICENSE](LICENSE) file for details.

---
