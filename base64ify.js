var mime = require("mime-types");
var fs = require("fs");

function base64ifyHTML(html, blacklist) {
    blacklist = (blacklist || []).map(mime.lookup);
    return html.replace(/src=".*(?=")/g, function(match) {
        try {
            var file = match.slice(5);
            var mimeType = mime.lookup(file);
            if (blacklist.indexOf(mimeType) >= 0) {
                return match;
            }
            else {
                return "src=\"data:" + mimeType + ";base64," + fs.readFileSync(file).toString("base64");
            }
        }
        catch (e) {
            return match;
        }
    });
}

function base64ifyCSS(css, blacklist) {
    blacklist = (blacklist || []).map(mime.lookup);
    return css.replace(/url\(.*(?=\))/g, function(match) {
        try {
            var file = match.slice(4);
            var mimeType = mime.lookup(file);
            if (blacklist.indexOf(mimeType) >= 0) {
                return match;
            }
            else {
                return "url(data:" + mimeType + ";base64," + fs.readFileSync(file).toString("base64");
            }
        }
        catch (e) {
            return match;
        }
    });
}
