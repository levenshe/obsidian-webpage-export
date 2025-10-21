# Webpage HTML Export

Export html from single files, canvas pages, or whole vaults. Direct access to the exported HTML files allows you to publish your digital garden anywhere. Focuses on flexibility, features, and styl[...]  
Demo / docs: [docs.obsidianweb.net](https://docs.obsidianweb.net/)

![image](https://github.com/KosmosisDire/obsidian-webpage-export/assets/39423700/b8e227e4-b12c-47fb-b341-5c5c2f092ffa)

![image](https://github.com/KosmosisDire/obsidian-webpage-export/assets/39423700/06f29e1a-c067-45e7-9882-f9d6aa83776f)

> [!NOTE]  
> Although the plugin is fully functional it is still under development, so there may be frequent large changes between updates that could effect your workflow! Bugs are also not uncommon, please [...]  

## Features:
- Full text search
- File navigation tree
- Document outline
- Graph view
- Theme toggle
- Optimized for web and mobile
- Most plugins supported (dataview, tasks, etc...)
- Option to export html and dependencies into one single file

## Using the Plugin
Check out the new docs for details on using the plugin:
https://docs.obsidianweb.net/

## Installation

Install from Obsidian Community Plugins: [Open in Obsidian](https://obsidian.md/plugins?id=webpage-html-export)

### Manual Installation

1. Download the `.zip` file from the [Latest Release](https://github.com/KosmosisDire/obsidian-webpage-export/releases/latest), or from any other release version.
2. Unzip into: `{VaultFolder}/.obsidian/plugins/`
3. Reload obsidian

### Beta Installation

Either follow the instructions above for a beta release, or:

1. Install the [BRAT plugin](https://obsidian.md/plugins?id=obsidian42-brat)
2. Open the brat settings
3. Select add beta plugin
4. Enter `https://github.com/KosmosisDire/obsidian-webpage-export` as the repository.
5. Select Add Plugin

## Contributing

Only start work on features which have an issue created for them and have been accepted by me!
A contribution guide may come soon.

## Support This Plugin

This plugin takes a lot of work to maintain and continue adding features. If you want to fund the continued development of this plugin you can do so here:

<a href="https://www.buymeacoffee.com/nathangeorge"><img src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=nathangeorge&button_colour=3ebba4&font_colour=ffffff&f[...]  

or if you prefer paypal:  

<a href="https://www.paypal.com/donate/?business=HHQBAXQQXT84Q&no_recurring=0&item_name=Hey+%F0%9F%91%8B+I+am+a+Computer+Science+student+working+on+obsidian+plugins.+Thanks+for your+support%21&cur[...]  

## Testing

This project is tested with BrowserStack.
[BrowserStack](https://www.browserstack.com/open-source) offers free web testing to open source projects, but does not support this project in any other way.

## CLI 使用說明（webpage-export）

安裝為全域指令（在專案根目錄）：

  npm install -g .

或直接從 GitHub 安裝：

  npm install -g github:levenshe/obsidian-webpage-export

執行範例：

  webpage-export --input /path/to/vault --out ./public

選項：
  -i, --input    指定輸入路徑（例如 Vault 或要匯出的檔案）
  -o, --out      指定輸出資料夾或檔案
  -v, --verbose  顯示詳細日誌

CLI 行為：
- CLI 會嘗試在下列常見位置 require 專案內的 exporter 函式：
  - index.js, lib/index.js, src/index.js, dist/index.js
  - 若找到函式，會呼叫並傳入物件：{ input, out, verbose }
- 若找不到本地匯出模組，CLI 會 fallback 去執行：
  npm run export -- --input <...> --out <...>
  請確保你的 package.json 若要使用 fallback，已定義一個 "export" 腳本。