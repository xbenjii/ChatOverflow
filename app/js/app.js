'use strict';

const fs = require('fs');
const remote = require('electron').remote;

const menuTemplate = require('./js/menu');
const contextMenuTemplate = require('./js/contextMenu');

const Menu = remote.Menu;

const webview = document.querySelector('#webview');

const plugins = require('./js/plugins')(webview);

const menu = Menu.buildFromTemplate(menuTemplate);
const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);

Menu.setApplicationMenu(menu);
window.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	contextMenu.popup(remote.getCurrentWindow());
}, false);

webview.addEventListener('did-start-loading', () => NProgress.start());
webview.addEventListener('did-stop-loading', () => NProgress.done());

webview.addEventListener('new-window', (event) => {
	if(event.url.includes('chat.stackoverflow.com') && event.disposition === 'foreground-tab') {
		webview.loadURL(event.url);
	} else {
		window.open(event.url);
	}
});
