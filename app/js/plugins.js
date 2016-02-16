const path = require('path');

module.exports = function(webview) {
    fs.readdir(path.resolve(`./plugins`), (err, plugins) => {
    	if(err) {
    		return console.log(`Error reading plugins folder: ${err}`);
    	}
    	webview.addEventListener('did-navigate', (event) => {
    		plugins.forEach((plugin) => {
    			const pluginSettings = require(path.resolve(`./plugins/${plugin}/settings.json`));
    			if(event.url.match(new RegExp(pluginSettings.page))) {
    				if(typeof pluginSettings.files !== 'undefined' && Array.isArray(pluginSettings.files)) {
    					pluginSettings.files.forEach((file) => {
    						if(file.includes('.css')) {
                                loadPlugin('css', `./plugins/${plugin}/${file}`)
                                    .then(() => console.log(`Loaded plugin ${plugin}/${file}`));
    						} else if(file.includes('.js')) {
                                loadPlugin('js', `./plugins/${plugin}/${file}`)
                                    .then(() => console.log(`Loaded plugin ${plugin}/${file}`));
    						}
    					});
    				}
    			}
    		});
    	});
    });

    function loadPlugin(type, path) {
        return readFile(path)
            .then((code) => {
                if(type === 'css') {
                    webview.insertCSS(code);
                } else if (type === 'js') {
                    webview.executeJavaScript(code);
                }
            });
    }

    function readFile(file) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.resolve(file), 'utf8', (err, code) => {
                if(err) return reject(err);
                resolve(code);
            });
        });
    }

};
