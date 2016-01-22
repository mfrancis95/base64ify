var fs = require("fs");
var cheerio = require("cheerio");
var mime = require("mime-types");

function base64ify(html, callback) {
    var elements = 0, elementsDone = 0;
    var $ = cheerio.load(html);
    var images = $("img");
    elements += images.length;
    if (elements === 0) {
        if (callback) {
            callback($.html());
        }
    }
    else {
        images.each(function() {
            var image = $(this);
            var src = image.attr("src");
            fs.readFile(src, function(error, data) {
                if (!error) {
                    image.attr("src", "data:" + mime.lookup(src) + ";base64," + data.toString("base64"));
                }
                if (++elementsDone === elements) {
                    callback($.html());
                }
            });
        });
    }
}
