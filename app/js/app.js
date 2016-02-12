'use strict';

const fs = require('fs');
const remote = require('electron').remote;

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const webview = document.querySelector('#webview');

fs.readdir(`./plugins`, (err, plugins) => {
	if(err) {
		console.log(`Error reading plugins folder: ${err}`);
	}
	webview.addEventListener('did-navigate', (event) => {
		plugins.forEach((plugin) => {
			const pluginSettings = require(`../plugins/${plugin}/settings.json`);
			if(event.url.match(new RegExp(pluginSettings.page))) {
				if(typeof pluginSettings.files !== 'undefined' && Array.isArray(pluginSettings.files)) {
					pluginSettings.files.forEach((file) => {
						if(file.includes('.css')) {
							console.log(`Loading plugin ${plugin}/${file}`)
							fs.readFile(`./plugins/${plugin}/${file}`, (err, code) => {
								if(err) {
									console.log(`Error loading plugin (${plugin}/${file}): ${err}`);
								}
								webview.insertCSS(code);
							});
						} else if(file.includes('.js')) {
							console.log(`Loading plugin ${plugin}/${file}`);
							fs.readFile(`./plugins/${plugin}/${file}`, (err, code) => {
								if(err) {
									console.log(`Error loading plugin (${plugin}/${file}): ${err}`);
								}
								webview.executeJavaScript(code);
							});
						}
					});
				}
			}
		});
	});
});

webview.addEventListener('did-start-loading', () => NProgress.start());
webview.addEventListener('did-stop-loading', () => NProgress.done());