/* Taxiderm homepage */
var ejs = require('ejs'),
fs = require('fs'),
path = require('path');

var homeTemplate;
fs.readFile(path.join(__dirname, 'views', 'homepage.ejs'), 'utf8', function (err, tpl) {
  console.log(err, tpl);
  homeTemplate = ejs.compile(tpl);
});

exports.render = function(req, res, ctx) {
  var body = homeTemplate(ctx);
  res.writeHead(200, {
    'Content-Length': body.length,
    'Content-Type': 'text/html; charset=UTF-8'
  });
  res.end(body);
};