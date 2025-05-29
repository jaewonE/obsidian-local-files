// src/contentProcessor.ts

import { App, TFile, Notice, MarkdownView } from "obsidian";
import LocalImagesPlugin from "./main";
import {
	downloadImageToArrayBuffer,
	getImageExtensionFromUrlOrHeaders,
	getImageExtensionFromUrlOnly, // New import
	isExtensionAllowed, // New import
	generateUniqueImageNameAndPath,
	analyzeImage,
	verifyImage,
	ImageMeta,
} from "./utils";

const EXTERNAL_IMAGE_LINK_REGEX =
	/(!\[(?<altText>[^\]\|]*)\|?(?<sizeOrAlias>[^\]]*)\]\((?<url>https?:\/\/[^\)]+)\))/g;

interface ProcessedImageInfo {
	newLinkMarkdown: string;
	originalLinkMarkdown: string;
	startIndex: number;
	endIndex: number;
}

export class ContentProcessor {
	private app: App;
	private plugin: LocalImagesPlugin;
	private usedCountersInSession: Set<number> = new Set(); // Track used counters in this session

	constructor(app: App, plugin: LocalImagesPlugin) {
		this.app = app;
		this.plugin = plugin;
	}

	async processActiveLeaf(): Promise<void> {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) {
			new Notice("No active Markdown view. Please open a note.");
			return;
		}

		const currentFile = activeView.file;
		if (!currentFile) {
			new Notice("No file associated with the active view.");
			return;
		}

		// Get the leaf and check if it's in preview mode
		const leaf = activeView.leaf;
		const viewState = leaf.getViewState();
		const originalMode = viewState.state?.mode;
		const wasInPreviewMode = originalMode === "preview";

		// If in preview mode, switch to editing mode temporarily
		if (wasInPreviewMode) {
			// @ts-ignore
			viewState.state["mode"] = "source";
			await leaf.setViewState(viewState);
			// Small delay to ensure the editor is ready
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		// Now get the editor (should be available since we switched to source mode if needed)
		const editor = activeView.editor;
		if (!editor) {
			new Notice("Could not access editor. Please try again.");
			return;
		}

		const originalContent = editor.getValue();
		const processedImageReplacements: ProcessedImageInfo[] = [];
		let imagesFound = 0;
		let imagesProcessed = 0;
		let imagesSkipped = 0;
		let imagesReused = 0;

		// Reset the counter tracking for this processing session
		this.usedCountersInSession = new Set<number>();

		const matches = Array.from(
			originalContent.matchAll(EXTERNAL_IMAGE_LINK_REGEX)
		);
		imagesFound = matches.length;

		if (imagesFound === 0) {
			new Notice("No external image links found in the current note.");

			// Switch back to preview mode if that was the original state
			if (wasInPreviewMode) {
				// @ts-ignore
				viewState.state["mode"] = "preview";
				await leaf.setViewState(viewState);
			}
			return;
		}

		new Notice(
			`Found ${imagesFound} external image(s). Starting download...`
		);

		for (const match of matches) {
			const originalLinkMarkdown = match[0];
			const imageUrl = match.groups?.url;
			const altText = match.groups?.altText || "";
			const sizeOrAlias = match.groups?.sizeOrAlias?.trim() || "";

			const startIndex = match.index ?? -1;
			const endIndex = startIndex + originalLinkMarkdown.length;

			if (!imageUrl || startIndex === -1) continue;

			// 1. Check if URL was processed before and get metadata
			const existingMetadata = this.plugin.getProcessedUrlMeta(imageUrl);

			if (existingMetadata) {
				// 2. Verify that the existing file matches the metadata
				const isImageValid = await verifyImage(
					this.app,
					existingMetadata
				);

				if (isImageValid) {
					// Image is valid, reuse it
					const existingFile = this.app.vault.getAbstractFileByPath(
						existingMetadata.filePath
					) as TFile;

					// Create link content with size/alias if needed
					let linkContent = existingFile.name;
					if (sizeOrAlias) {
						linkContent += `|${sizeOrAlias}`;
					}

					const newLinkMarkdown = `![[${linkContent}]]`;

					processedImageReplacements.push({
						newLinkMarkdown,
						originalLinkMarkdown,
						startIndex,
						endIndex,
					});

					imagesReused++;
					new Notice(
						`Reusing existing local file: ${existingFile.basename}`,
						3000
					);
					continue;
				}
				// If verification fails, fall through to re-download the image
				console.log(
					`Image verification failed for ${imageUrl}, re-downloading...`
				);
			}

			// Before downloading, try to check extension from URL
			const urlExtension = getImageExtensionFromUrlOnly(imageUrl);
			if (
				urlExtension &&
				!isExtensionAllowed(
					urlExtension,
					this.plugin.pluginData.settings.allowedExtensions
				)
			) {
				console.log(
					`Skipping download of ${imageUrl}: extension ${urlExtension} is not in the allowed list.`
				);
				imagesSkipped++;
				continue; // Skip to next image
			}

			// 3. File doesn't exist, validation failed, or was never processed, download it
			try {
				const downloadResult = await downloadImageToArrayBuffer(
					imageUrl
				);
				if (!downloadResult) {
					new Notice(
						`Failed to download: ${imageUrl.substring(0, 50)}...`,
						5000
					);
					continue;
				}
				const { arrayBuffer, headers } = downloadResult;

				const extension = getImageExtensionFromUrlOrHeaders(
					imageUrl,
					headers
				);

				// Final check if extension is in the allowed list (in case URL didn't show the real extension)
				if (
					!isExtensionAllowed(
						extension,
						this.plugin.pluginData.settings.allowedExtensions
					)
				) {
					new Notice(
						`Skipped file with disallowed extension: ${extension}`,
						5000
					);
					imagesSkipped++;
					continue; // Skip to next image
				}

				const noteBasename = currentFile.basename;

				// Pass the usedCountersInSession to track used counters in this processing session
				const {
					fileName: actualSavedImageName,
					fullPath: newImageFullPath,
				} = await generateUniqueImageNameAndPath(
					this.app,
					noteBasename,
					extension,
					currentFile,
					this.usedCountersInSession // Pass session counters to prevent duplicates
				);

				const newImageFile = await this.app.vault.createBinary(
					newImageFullPath,
					arrayBuffer
				);
				if (!newImageFile) {
					new Notice(
						`Failed to save image: ${actualSavedImageName}`,
						5000
					);
					continue;
				}

				// Generate image metadata and store it
				try {
					const mimeType =
						headers.get("content-type") || `image/${extension}`;
					const imageMeta = await analyzeImage(
						this.app,
						newImageFullPath,
						arrayBuffer,
						mimeType
					);

					// Store URL -> metadata mapping
					this.plugin.addProcessedUrl(imageUrl, imageMeta);
				} catch (error) {
					console.error(`Error analyzing image metadata: ${error}`);
					// Continue processing even if metadata creation fails
				}

				// Use the actual saved file name (which is now guaranteed to be unique)
				let newLocalLinkContent = actualSavedImageName;

				if (sizeOrAlias) {
					newLocalLinkContent += `|${sizeOrAlias}`;
				}

				const newLinkMarkdown = `![[${newLocalLinkContent}]]`;

				processedImageReplacements.push({
					newLinkMarkdown,
					originalLinkMarkdown,
					startIndex,
					endIndex,
				});

				imagesProcessed++;
			} catch (error) {
				console.error(`Error processing image ${imageUrl}:`, error);
				new Notice(
					`Error processing ${imageUrl.substring(
						0,
						50
					)}... Check console.`,
					5000
				);
			}
		}

		// After all processing is complete
		if (processedImageReplacements.length > 0) {
			processedImageReplacements.sort(
				(a, b) => b.startIndex - a.startIndex
			);

			let newDocContent = originalContent;
			for (const replacement of processedImageReplacements) {
				newDocContent =
					newDocContent.substring(0, replacement.startIndex) +
					replacement.newLinkMarkdown +
					newDocContent.substring(replacement.endIndex);
			}
			editor.setValue(newDocContent);
		}

		// Save the persistently processed URLs after the entire operation
		await this.plugin.savePluginData();

		let finalMessage = `Image processing complete. `;
		if (imagesProcessed > 0)
			finalMessage += `Downloaded: ${imagesProcessed}`;
		if (imagesReused > 0) finalMessage += `, Reused: ${imagesReused}`;
		if (imagesSkipped > 0) finalMessage += `, Skipped: ${imagesSkipped}`;

		const failedCount =
			imagesFound - imagesProcessed - imagesSkipped - imagesReused;
		if (failedCount > 0) finalMessage += `, Failed: ${failedCount}`;

		new Notice(finalMessage, 7000);

		// After processing, restore the original mode if it was preview
		if (wasInPreviewMode) {
			// @ts-ignore
			viewState.state["mode"] = "preview";
			await leaf.setViewState(viewState);
		}
	}
}
