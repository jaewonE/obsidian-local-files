// src/utils.ts

import {
        App,
        requestUrl,
        RequestUrlResponse,
        TFile,
        normalizePath,
        Setting,
} from "obsidian";
import { join } from "path"; // Using Node.js path join for robust path construction

/**
 * Interface for image metadata storage and verification
 */
export interface ImageMeta {
	filePath: string;
	size: number; // file size in bytes
	width: number; // image width in pixels
	height: number; // image height in pixels
	hash: string; // SHA-256 hash of the image content
}

// Define a more specific type for common image MIME types
type ImageMimeType =
	| "image/jpeg"
	| "image/png"
	| "image/gif"
	| "image/webp"
	| "image/svg+xml"
	| "image/bmp"
	| "image/tiff";

const MIME_TO_EXT: Record<ImageMimeType, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/gif": "gif",
	"image/webp": "webp",
	"image/svg+xml": "svg",
	"image/bmp": "bmp",
	"image/tiff": "tif",
};

/**
 * Downloads an image from a given URL.
 * @param url The URL of the image to download.
 * @returns A promise that resolves to an object containing the ArrayBuffer and Headers, or null if download fails.
 */
export async function downloadImageToArrayBuffer(
	url: string
): Promise<{ arrayBuffer: ArrayBuffer; headers: Headers } | null> {
	try {
		const response: RequestUrlResponse = await requestUrl({ url });
		if (response.status !== 200) {
			console.error(
				`Failed to download image from ${url}. Status: ${response.status}`
			);
			return null;
		}
		return {
			arrayBuffer: response.arrayBuffer,
			headers: new Headers(response.headers),
		};
	} catch (error) {
		console.error(`Error downloading image from ${url}:`, error);
		return null;
	}
}

/**
 * Tries to determine the image extension from the URL or response headers.
 * @param imageUrl The URL of the image.
 * @param headers Optional response headers from the download.
 * @returns The determined image extension (e.g., "png") or a default if undetermined.
 */
export function getImageExtensionFromUrlOrHeaders(
	imageUrl: string,
	headers?: Headers
): string {
	// Try Content-Type header first
	if (headers) {
		const contentTypeHeader = headers.get("content-type");
		if (contentTypeHeader) {
			const mimeType = contentTypeHeader
				.split(";")[0]
				.trim() as ImageMimeType;
			if (MIME_TO_EXT[mimeType]) {
				return MIME_TO_EXT[mimeType];
			}
		}
	}

	// Fallback to URL extension
	try {
		const SANE_URL = new URL(imageUrl);
		const extension = SANE_URL.pathname.split(".").pop();
		if (
			extension &&
			/^[a-zA-Z0-9]+$/.test(extension) &&
			extension.length < 5
		) {
			// Basic validation for common extensions
			return extension.toLowerCase();
		}
	} catch (error) {
		console.warn(
			`Could not parse URL to get extension: ${imageUrl}`,
			error
		);
	}

	// Default extension if none could be determined
	console.warn(
		`Could not determine extension for ${imageUrl}, defaulting to 'png'.`
	);
	return "png";
}

/**
 * Sanitizes a string to be used as part of a filename.
 * Replaces characters that are problematic in filenames.
 * @param name The string to sanitize.
 * @returns A sanitized string suitable for filenames.
 */
export function sanitizeFileName(name: string): string {
        return name.replace(/[\\/:*?"<>|#%&{}]/g, "_");
}

/**
 * Escapes special characters in a string for use in a regular expression.
 * @param str The string to escape.
 * @returns The escaped string safe for RegExp construction.
 */
export function escapeRegExp(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Determines the target attachment folder path based on Obsidian's settings.
 * Creates the folder if it doesn't exist.
 * @param app The Obsidian App instance.
 * @param currentNote The TFile of the note for which attachments are being processed.
 * @returns The absolute path (from vault root) to the attachment folder.
 */
export async function getOrCreateAttachmentFolder(
	app: App,
	currentNote: TFile
): Promise<string> {
	let attachmentFolderPath: string;

	// Use Obsidian's logic to determine where new attachments for the currentNote should go.
	// `getNewFileParent` considers "Vault folder specified below", "Same folder as current file",
	// or "In subfolder under current folder".
	const parentFolder = app.fileManager.getNewFileParent(currentNote.path);
	attachmentFolderPath = parentFolder.path;

	// If a specific attachment folder is configured globally, it might override the above.
	// However, `getNewFileParent` *should* respect `attachmentFolderPath` when `newFileLocation` is set to "folder".
	// Let's ensure the user's global attachment folder path is used if specified.
	// @ts-ignore
	const globalAttachmentFolder = app.vault.getConfig("attachmentFolderPath");

	if (globalAttachmentFolder && globalAttachmentFolder !== "/") {
		// If a specific folder is set
		if (globalAttachmentFolder.startsWith("./")) {
			// Relative to the current file's folder
			attachmentFolderPath = normalizePath(
				join(
					currentNote.parent?.path || "",
					globalAttachmentFolder.substring(2)
				)
			);
		} else {
			// Absolute path from the vault root
			attachmentFolderPath = normalizePath(globalAttachmentFolder);
		}
	}

	// Ensure the determined folder path exists
	if (
		attachmentFolderPath !== "/" &&
		!(await app.vault.adapter.exists(attachmentFolderPath))
	) {
		try {
			await app.vault.createFolder(attachmentFolderPath);
		} catch (error) {
			console.error(
				`Error creating attachment folder: ${attachmentFolderPath}. Defaulting to note's parent folder.`,
				error
			);
			// Fallback to the note's current folder if creation fails
			return currentNote.parent?.path || "/";
		}
	}
	return attachmentFolderPath === "/" ? "" : attachmentFolderPath; // Return "" for vault root, consistent with join
}

/**
 * Generates a unique image filename and its full path in the determined attachment folder.
 * The filename format is `[noteBasename]-[counter].[extension]`.
 * The counter is determined by finding the next available number based on existing files
 * with the same noteBasename and extension in the target folder.
 * @param app The Obsidian App instance.
 * @param noteBasename The basename of the current note (without extension).
 * @param extension The image file extension.
 * @param currentNote The TFile of the current note.
 * @param usedCounters Set of counters already used in this session (to prevent duplicates)
 * @returns An object containing the unique filename, its full normalized path, and the attachment folder path.
 */
export async function generateUniqueImageNameAndPath(
	app: App,
	noteBasename: string,
	extension: string,
	currentNote: TFile,
	usedCounters: Set<number> = new Set()
): Promise<{
	fileName: string;
	fullPath: string;
	attachmentFolderPath: string;
}> {
	const attachmentFolderPath = await getOrCreateAttachmentFolder(
		app,
		currentNote
	);
        const saneBase = sanitizeFileName(noteBasename);
        const escapedBase = escapeRegExp(saneBase);

	/* ①   현재 폴더에 이미 존재하는 `[basename]-숫자.*` 를 모두 수집 */
	const used = new Set<number>([...usedCounters]); // Include already used counters from this session
	for (const f of app.vault.getFiles()) {
		if ((f.parent?.path || "") !== attachmentFolderPath) continue;

                const m = f.basename.match(new RegExp(`^${escapedBase}-(\\d+)$`, "i"));
		if (m) used.add(Number(m[1]));
	}

	/* ②   가장 작은 미사용 번호 선택 */
	let counter = 1;
	while (used.has(counter)) counter++;

	/* ③   최종 파일명 / 전체 경로 생성 */
	console.log(
		`[Plugin] Local files:: Generating unique image name: ${saneBase}-${counter}.${extension}`
	);
	const fileName = `${saneBase}-${counter}.${extension.toLowerCase()}`;
	const fullPath = normalizePath(
		attachmentFolderPath ? join(attachmentFolderPath, fileName) : fileName
	);

	// Add the counter to the used set to prevent reuse in the same session
	usedCounters.add(counter);

	return { fileName, fullPath, attachmentFolderPath };
}

/**
 * Generates a SHA-256 hash from an ArrayBuffer.
 * @param buffer The image content as ArrayBuffer.
 * @returns Promise resolving to a hex string hash.
 */
export async function generateHash(buffer: ArrayBuffer): Promise<string> {
	// Use Web Crypto API for hashing
	const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

	// Convert to hex string
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Gets image dimensions from an ArrayBuffer.
 * @param buffer The image data as ArrayBuffer.
 * @param mimeType The MIME type of the image.
 * @returns Promise resolving to {width, height} in pixels.
 */
export async function getImageDimensions(
	buffer: ArrayBuffer,
	mimeType: string
): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		// Create a blob from the buffer
		const blob = new Blob([buffer], { type: mimeType });
		const url = URL.createObjectURL(blob);

		// Create an image element to load the blob
		const img = new Image();
		img.onload = () => {
			const dimensions = {
				width: img.width,
				height: img.height,
			};
			URL.revokeObjectURL(url);
			resolve(dimensions);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Failed to load image for dimension analysis"));
		};
		img.src = url;
	});
}

/**
 * Analyzes an image file and generates comprehensive metadata.
 * @param app The Obsidian App instance.
 * @param filePath Path to the image file in the vault.
 * @param buffer Optional ArrayBuffer of the image (to avoid reading it twice).
 * @param mimeType Optional MIME type of the image.
 * @returns Promise resolving to ImageMeta object.
 */
export async function analyzeImage(
	app: App,
	filePath: string,
	buffer?: ArrayBuffer,
	mimeType?: string
): Promise<ImageMeta> {
	const file = app.vault.getAbstractFileByPath(filePath) as TFile;
	if (!file) {
		throw new Error(`File not found: ${filePath}`);
	}

	// If buffer not provided, read it from the file
	if (!buffer) {
		buffer = await app.vault.readBinary(file);
	}

	// Get file size
	const size = buffer.byteLength;

	// Get MIME type if not provided
	if (!mimeType) {
		mimeType =
			file.extension === "svg"
				? "image/svg+xml"
				: `image/${file.extension}`;
	}

	// Get image dimensions
	const { width, height } = await getImageDimensions(buffer, mimeType);

	// Generate hash
	const hash = await generateHash(buffer);

	return {
		filePath,
		size,
		width,
		height,
		hash,
	};
}

/**
 * Verifies if an image file matches the stored metadata.
 * @param app The Obsidian App instance.
 * @param oldMeta Previously stored metadata for comparison.
 * @returns Promise resolving to boolean indicating if the file matches the metadata.
 */
export async function verifyImage(
	app: App,
	oldMeta: ImageMeta
): Promise<boolean> {
	try {
		const file = app.vault.getAbstractFileByPath(oldMeta.filePath) as TFile;
		if (!file) return false;

		// First check file size as a quick filter (avoids reading the file if size differs)
		const fileSize = file.stat.size;
		if (fileSize !== oldMeta.size) {
			console.log(
				`File size mismatch for ${oldMeta.filePath}: ${fileSize} vs ${oldMeta.size}`
			);
			return false;
		}

		// Read the file content
		const buffer = await app.vault.readBinary(file);

		// Get MIME type
		const mimeType =
			file.extension === "svg"
				? "image/svg+xml"
				: `image/${file.extension}`;

		// Check image dimensions
		try {
			const { width, height } = await getImageDimensions(
				buffer,
				mimeType
			);
			if (width !== oldMeta.width || height !== oldMeta.height) {
				console.log(
					`Dimension mismatch for ${oldMeta.filePath}: ${width}x${height} vs ${oldMeta.width}x${oldMeta.height}`
				);
				return false;
			}
		} catch (error) {
			console.error(`Error checking dimensions: ${error}`);
			return false;
		}

		// As a final check, compare hash
		const hash = await generateHash(buffer);
		if (hash !== oldMeta.hash) {
			console.log(
				`Hash mismatch for ${oldMeta.filePath}: ${hash} vs ${oldMeta.hash}`
			);
			return false;
		}

		return true;
	} catch (error) {
		console.error(`Error verifying image: ${error}`);
		return false;
	}
}

/**
 * Tries to determine the image extension from just the URL (without downloading).
 * @param imageUrl The URL of the image.
 * @returns The determined image extension or null if undetermined.
 */
export function getImageExtensionFromUrlOnly(imageUrl: string): string | null {
	try {
		const urlObj = new URL(imageUrl);
		const extension = urlObj.pathname.split(".").pop();
		if (
			extension &&
			/^[a-zA-Z0-9]+$/.test(extension) &&
			extension.length < 5
		) {
			// Basic validation for common extensions
			return extension.toLowerCase();
		}
	} catch (error) {
		console.warn(
			`Could not parse URL to get extension: ${imageUrl}`,
			error
		);
	}
	return null;
}

/**
 * Checks if a file extension is in the allowed list.
 * @param extension The extension to check (without dot)
 * @param allowedExtensions Comma-separated list of allowed extensions
 * @returns Boolean indicating if the extension is allowed
 */
export function isExtensionAllowed(
	extension: string,
	allowedExtensions: string
): boolean {
	if (!extension || !allowedExtensions) return false;

	const allowedList = allowedExtensions
		.toLowerCase()
		.split(",")
		.map((ext) => ext.trim());
	return allowedList.includes(extension.toLowerCase());
}
