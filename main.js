'use strict';

const electron = require('electron');
const fs = require('fs');

const settings = require('./settings.json');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if(process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	if(mainWindow === null) createWindow();
});

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 768,
		title: 'ChatOverflow',
		icon: 'so-icon.png'
	});
	mainWindow.loadURL(`file://${__dirname}/app/index.html`);
	if(settings.devMode) {
		mainWindow.webContents.openDevTools();
	}
	mainWindow.on('closed', () => mainWindow = null);
}