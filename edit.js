define(function(require, exports, module){
	var TextEditor = require('./lib/richEdit');
	var RichEditConfig = require('./lib/editConfig');
	function main(){
		new TextEditor(RichEditConfig);
	}

	exports.init = main;
})