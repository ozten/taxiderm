/* Fill in template skins and display page */
var _ = require('underscore'),
    data = require('../lib/data'),
    ejs = require('ejs'),
    escapeHtml = require('escape-html'),
    fs = require('fs');

exports.render = function(req, res, ctx) {
  // Which template are we previewing?
  var path = "id_mismatch.ejs"; // TODO from req
  var flavor = "ID Mismatch Error"; // TODO from req
  var raw = fs.readFileSync(ctx.templateRoot + '/id_mismatch.ejs');
  var template = ejs.compile(raw.toString('utf8'));

  var vars = _.extend({}, ctx.screens[0].variables, ctx.globalVars);
  data.prepare(vars);

  var body;

  try {
    body = template(vars);
  } catch (e) {
    // TODO X is 
    body = "<!DOCTYPE html>\n";
    body += "<pre>" + escapeHtml(e.toString('utf8')) + "</pre>";
  }
  body += '<script src="/trophy.js"></script>';
  res.writeHead(200, {
    'Content-Length': body.length,
    'Content-Type': 'text/html; charset=UTF-8'
  });
  res.end(body);
};