// src/config.ts

import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import LocalImagesPlugin from "./main";
import { ImageMeta } from "./utils";

/**
 * Interface for the plugin's settings.
 * Only user-facing settings are here.
 * Internal data like processed URLs will be handled by loadData/saveData directly in main.ts.
 */
export interface LocalImagesSettings {
	showRibbonIcon: boolean;
	allowedExtensions: string; // New setting for allowed file extensions
}

export const DEFAULT_SETTINGS: LocalImagesSettings = {
	showRibbonIcon: true,
	allowedExtensions: "jpg,jpeg,png,gif,webp,svg,bmp,tif,tiff", // Default allowed extensions
};

/**
 * Data structure for persistent storage using loadData/saveData.
 */
export interface LocalImagesPluginData {
	settings: LocalImagesSettings;
	processedImageUrls: Record<string, ImageMeta>; // Updated: Stores URLs mapped to their metadata
}

export const DEFAULT_PLUGIN_DATA: LocalImagesPluginData = {
	settings: DEFAULT_SETTINGS,
	processedImageUrls: {},
};

export class LocalImagesSettingTab extends PluginSettingTab {
	plugin: LocalImagesPlugin;

	constructor(app: App, plugin: LocalImagesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Local Images Settings" });

		new Setting(containerEl)
			.setName("Show Ribbon Icon")
			.setDesc("Toggle the display of the plugin icon in the ribbon.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.pluginData.settings.showRibbonIcon)
					.onChange(async (value) => {
						this.plugin.pluginData.settings.showRibbonIcon = value;
						await this.plugin.savePluginData();
						this.plugin.updateRibbonIcon();
					})
			);

		// New setting for allowed file extensions
		new Setting(containerEl)
			.setName("Allowed File Extensions")
			.setDesc(
				"Comma-separated list of file extensions to download (without dots). Only files with these extensions will be downloaded."
			)
			.addText((text) =>
				text
					.setPlaceholder("jpg,jpeg,png,gif,webp,svg,bmp,tif,tiff")
					.setValue(this.plugin.pluginData.settings.allowedExtensions)
					.onChange(async (value) => {
						this.plugin.pluginData.settings.allowedExtensions =
							value;
						await this.plugin.savePluginData();
					})
			);

		// New button to clear the cache
		new Setting(containerEl)
			.setName("Clear Downloaded Images Cache")
			.setDesc(
				"Reset the list of previously downloaded images. This will cause images to be re-downloaded the next time they are detected."
			)
			.addButton((button) =>
				button.setButtonText("Clear Cache").onClick(async () => {
					this.plugin.pluginData.processedImageUrls = {};
					await this.plugin.savePluginData();
					new Notice("Image cache cleared successfully!");
				})
			);
	}
}
