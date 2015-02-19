"use strict";

function getScript(src) {
    document.write('<' + 'script src="' + src + '"'
            + ' type="text/javascript"><' + '/script>');
}

function getScript2(src) {
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = src;
    headID.appendChild(newScript);

}

/*
 * if load from index.html should be _baseDir === "js". if load from jasmine
 * should be "src".
 *
 * @see pom.xml <srcDirectoryName/> in jasmine configuration
 */
var _baseDir = (_baseDir || "js") + "/";

var imports = [ "index.js",
        "helper.js",
        "RecipeCtrl.js",
        "RecipeListCtrl.js",
        "RecipeDetailCtrl.js",
        "LoginController.js",
        "CommentController.js",
        "FermentationCtrl.js",
        "LogCtrl.js",
        "print.js",
        "notification.js",
        "data/AbmCtrl.js",
        "admin/AdminCtrl.js",
        "calculator/calculator.js",
        "device/device.js",
        "resources.js",
        "util/util.js",
        "util/brewersfriend.js",
        "Data.js",
        "user/SettingsCtrl.js",
        "water/water.js",
        "env.js",
        "ObjTree.js",
        "directive/abm.js",
        "observer/observer.js",
        "lib/jsonpath-0.8.0.js"
];

for ( var i = 0; i < imports.length; i++) {
    getScript(_baseDir + imports[i]);
}
