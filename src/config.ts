// src/config.ts

import { App, PluginSettingTab, Setting } from "obsidian";
import LocalImagesPlugin from "./main";

/**
 * Interface for the plugin's settings.
 * Only user-facing settings are here.
 * Internal data like processed URLs will be handled by loadData/saveData directly in main.ts.
 */
export interface LocalImagesSettings {
	showRibbonIcon: boolean;
}

export const DEFAULT_SETTINGS: LocalImagesSettings = {
	showRibbonIcon: true,
};

/**
 * Data structure for persistent storage using loadData/saveData.
 */
export interface LocalImagesPluginData {
	settings: LocalImagesSettings;
	processedImageUrls: Record<string, string>; // Stores URLs mapped to their local file paths
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
	}
}
