/* Fill in template skins and display page */
var data = require('../lib/data'),
    ejs = require('ejs'),
    escapeHtml = require('escape-html'),
    fs = require('fs');

exports.render = function(req, res, ctx) {
  // Which template are we previewing?
  var path = "id_mismatch.ejs"; // TODO from req
  var flavor = "ID Mismatch Error"; // TODO from req
  var raw = fs.readFileSync(ctx.templateRoot + '/id_mismatch.ejs');
  var template = ejs.compile(raw.toString('utf8'));

  data.prepare(ctx.screens[0].variables);

  var body;

  try {
    body = template(ctx.screens[0].variables);
  } catch (e) {
    // TODO X is 
    body = "<!DOCTYPE html>\n";
    body += "<pre>" + escapeHtml(e.toString('utf8')) + "</pre>";
  }
  res.writeHead(200, {
    'Content-Length': body.length,
    'Content-Type': 'text/html; charset=UTF-8'
  });
  res.end(body);
};