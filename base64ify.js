var fs = require("fs");
var mime = require("mime-types");

function base64ifyHTML(html) {
    return html.replace(/src=".*(?=")/g, function(match) {
        var file = match.slice(5);
        try {
            return "src=\"data:" + mime.lookup(file) + ";base64," + fs.readFileSync(file).toString("base64");
        }
        catch (e) {
            return match;
        }
    });
}

function base64ifyCSS(css) {
    return css.replace(/url\(.*(?=\))/g, function(match) {
        try {
            var file = match.slice(4);
            return "url(data:" + mime.lookup(file) + ";base64," + fs.readFileSync(file).toString("base64");
        }
        catch (e) {
            return match;
        }
    });
}
