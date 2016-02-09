var mime = require("mime-types");
var fs = require("fs");

var srcRegex = /src=('|").*(?='|")/g;
var urlRegex = /url\(.*(?=\))/g;

function base64ifyHTML(html, blacklist) {
    blacklist = (blacklist || []).map(mime.lookup);
    return html.replace(srcRegex, function(match) {
        try {
            var file = match.slice(5);
            var mimeType = mime.lookup(file);
            if (blacklist.indexOf(mimeType) >= 0) {
                return match;
            }
            return "src=" + match[4] + "data:" + mimeType + ";base64," + fs.readFileSync(file).toString("base64");
        }
        catch (e) {
            return match;
        }
    });
}

function base64ifyCSS(css, blacklist) {
    blacklist = (blacklist || []).map(mime.lookup);
    return css.replace(urlRegex, function(match) {
        try {
            var file = match.slice(4);
            var mimeType = mime.lookup(file);
            if (blacklist.indexOf(mimeType) >= 0) {
                return match;
            }
            return "url(data:" + mimeType + ";base64," + fs.readFileSync(file).toString("base64");
        }
        catch (e) {
            return match;
        }
    });
}

console.log(base64ifyCSS(fs.readFileSync("test.css").toString()));
