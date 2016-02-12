'use strict';

const EventEmitter = require('events').EventEmitter;
const fs = require('fs');

module.exports = class PluginLoader extends EventEmitter {
	constructor(webview) {
		this.webview = webview;
		this.basePath = './plugins';
		this.listenForNavigation();
		getPlugins()
			.then((plugins) => {
				Promise.all(
					plugins.map((plugin) => {
						this.on('navigated', (url) => {
							if(url.match(new RegExp(plugin.settings.page))) {
								return this.readPlugin(plugin);
							}
						});
					})
				);
			});
	}
	getPlugins() {
		return new Promise((resolve, reject) => {
			fs.readdir('./plugins', (err, plugins) => {
				if(err) {
					return reject(err);
				}
				plugins.map(plugin => plugin.settings = this.getSettings(plugin));
				resolve(plugins);
			});
		});
	}
	readPlugin(path) {
		return new Promise((resolve, reject) => {
			fs.readFile(path, 'utf8', (err, code) => {
				if(err) {
					return reject(err);
				}
				resolve(code);
			});
		});
	}
	loadPlugin(plugin, files) {
		return new Promise((resolve, reject) => {
			files.forEach((file) => {
				if(file.includes('.css')) {
					fs.readFile(`./plugins/${plugin}/${file}`, 'utf8', (err, code) => {
						if(err) {
							return reject(err);
						}
						resolve(this.webview.insertCSS(code));
					});
				} else if(file.includes('.js')) {
					fs.readFile(`./plugins/${plugin}/${file}`, 'utf8', (err, code) => {
						if(err) {
							return reject(err);
						}
						resolve(this.webview.executeJavaScript(code));
					});
				}
			});
		});
	}
	getSettings(plugin) {
		const settings = require(`../plugins/${plugin}/settings.json`);
		if(typeof settings.files !== 'undefined' && Array.isArray(settings.files)) {
			return settings;
		} else {
			return {
				path: '.*',
				files: []
			};
		}
	}
	listenForNavigation() {
		this.webview.addEventListener('did-navigate', (event) => {
			this.emit('navigated', event.url);
		});
	}
}