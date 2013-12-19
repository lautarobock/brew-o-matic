/* You need uglify
// npm install -g uglify-js
// npm link uglify-js
// Run that into node and voila
*/
var FILE_ENCODING = 'utf-8',

EOL = '\n';

var fs = require('fs');

function concat(opts) {

	var fileList = opts.src;
	var distPath = opts.dest;
	var out = fileList.map(function(filePath){
		return fs.readFileSync(filePath, FILE_ENCODING);
	});

	fs.writeFileSync(distPath, out.join(EOL), FILE_ENCODING);
	console.log(' '+ distPath +' built.');
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var excludes = "lib";

function compressFolder(folder,files) {
	var base = fs.readdirSync(folder);
	for( var i=0; i < base.length; i++ ) {
		if ( base[i].endsWith(".js") ) {
			files.push(folder+base[i]);	
		} else {
			if ( excludes.indexOf(base[i]) == -1 ) {
				compressFolder(folder+base[i]+"/",files);	
			}
		}
	}
}

function min() {
	// var files = [];

	// var baseStr = "public/js/";
	
	// compressFolder(baseStr,files);

	files = [ "public/js/index.js",
        "public/js/helper.js",
        "public/js/RecipeCtrl.js",
        "public/js/RecipeListCtrl.js",
        "public/js/RecipeDetailCtrl.js",
        "public/js/LoginController.js",
        "public/js/CommentController.js",
        "public/js/FermentationCtrl.js",
        "public/js/LogCtrl.js",
        "public/js/notification.js",
        "public/js/data/AbmCtrl.js",
        "public/js/admin/AdminCtrl.js",
        "public/js/resources.js",
        "public/js/util/util.js",
        "public/js/Data.js",
        "public/js/env.js",
        "public/js/ObjTree.js",
        "public/js/directive/abm.js",
        "public/js/observer/observer.js"
	];

	var compressor = require('node-minify');
	console.log("Files",files);
	new compressor.minify({
	    type: 'gcc',
	    fileIn: files,
	    fileOut: 'build/scripts.min.js',
	    callback: function(err, min){
	        console.log("err:",err);
	        console.log("and you're done");
	        process.exit(1);
	    }
	});
}

min();



