// src/main.ts

import { Plugin, MarkdownView, Notice, WorkspaceLeaf, TFile } from "obsidian";
import {
	LocalImagesSettingTab,
	DEFAULT_PLUGIN_DATA,
	LocalImagesPluginData,
	LocalImagesSettings,
} from "./config";
import { ContentProcessor } from "./contentProcessor";

// ★ 레지스트리 타입
export interface DownloadRegistry {
	[url: string]: string;
}

interface PluginData {
	settings: LocalImagesSettings;
	registry: DownloadRegistry;
}

export default class LocalImagesPlugin extends Plugin {
	public pluginData!: LocalImagesPluginData; // Definite assignment assertion
	private ribbonIconEl?: HTMLElement;
	private contentProcessor!: ContentProcessor;

	async onload() {
		console.log("Loading Local Images Plugin (Modernized)");

		await this.loadPluginData();

		this.contentProcessor = new ContentProcessor(this.app, this);

		// Add settings tab
		this.addSettingTab(new LocalImagesSettingTab(this.app, this));

		// Add command
		this.addCommand({
			id: "download-local-images-current-note",
			name: "Download images locally for current note",
			// callback: () => this.contentProcessor.processActiveLeaf(), // Simple callback
			editorCallback: (editor, view) => {
				// Using editorCallback for context
				if (view.file) {
					this.contentProcessor.processActiveLeaf();
				} else {
					new Notice("Please open a markdown file first.");
				}
			},
		});

		// Add ribbon icon (conditionally)
		this.updateRibbonIcon();
	}

	async onunload() {
		console.log("Unloading Local Images Plugin (Modernized)");
		this.removeRibbonIcon();
	}

	async loadPluginData() {
		// Load data, merging with defaults if some parts are missing
		const loadedData = await this.loadData();
		this.pluginData = Object.assign({}, DEFAULT_PLUGIN_DATA, loadedData);
		// Ensure settings are also merged with defaults
		this.pluginData.settings = Object.assign(
			{},
			DEFAULT_PLUGIN_DATA.settings,
			loadedData?.settings
		);
		this.pluginData.processedImageUrls = Object.assign(
			{},
			DEFAULT_PLUGIN_DATA.processedImageUrls,
			loadedData?.processedImageUrls
		);
	}

	async savePluginData() {
		await this.saveData(this.pluginData);
	}

	/**
	 * Marks a URL as processed with its local file path.
	 * @param url The URL string to mark.
	 * @param filePath The local file path where the image was saved.
	 */
	addProcessedUrl(url: string, filePath: string): void {
		this.pluginData.processedImageUrls[url] = filePath;
		// Note: savePluginData() should be called after a batch of operations
	}

	/**
	 * Checks if a URL has already been processed and returns its file path.
	 * Also verifies if the file still exists.
	 *
	 * @param url The URL string to check.
	 * @returns The local file path if the URL has been processed and the file exists, null otherwise.
	 */
	getProcessedUrlFilePath(url: string): string | null {
		const filePath = this.pluginData.processedImageUrls[url];
		if (!filePath) return null;

		// Check if file exists
		const file = this.app.vault.getAbstractFileByPath(filePath);
		if (file instanceof TFile) {
			return filePath;
		}

		// File doesn't exist anymore, it was likely deleted
		console.log(`File for URL ${url} no longer exists at ${filePath}`);
		return null;
	}

	/**
	 * Updates or creates the ribbon icon based on settings.
	 */
	updateRibbonIcon(): void {
		this.removeRibbonIcon(); // Remove existing if any
		if (this.pluginData.settings.showRibbonIcon) {
			this.ribbonIconEl = this.addRibbonIcon(
				"download", // Obsidian built-in icon name
				"Download images locally",
				(evt: MouseEvent) => {
					const activeView =
						this.app.workspace.getActiveViewOfType(MarkdownView);
					if (activeView && activeView.file) {
						this.contentProcessor.processActiveLeaf();
					} else {
						new Notice(
							"Please open a markdown file to download images."
						);
					}
				}
			);
		}
	}

	/**
	 * Removes the ribbon icon if it exists.
	 */
	removeRibbonIcon(): void {
		if (this.ribbonIconEl) {
			this.ribbonIconEl.remove();
			this.ribbonIconEl = undefined;
		}
	}
}
