/* Fill in template skins and display page */
var _ = require('underscore'),
    data = require('../lib/data'),
    ejs = require('ejs'),
    escapeHtml = require('escape-html'),
    fs = require('fs');

var nameToIds;

exports.render = function(req, res, url, ctx) {
  // Which template are we previewing?
  var path = "id_mismatch.ejs"; // TODO from req
  var flavor = "ID Mismatch Error"; // TODO from req

  if (!nameToIds) {
    nameToIds = {};
    for (var i=0; i < ctx.screens.length; i++) {
      nameToIds['/' + escape(ctx.screens[i].linkTitle)] = i;
    }
  }
  var screenNumber = nameToIds[url.path];

  var raw = fs.readFileSync(ctx.templateRoot + '/' + ctx.screens[screenNumber].template);
  var template = ejs.compile(raw.toString('utf8'));

  var vars = _.extend({}, ctx.screens[screenNumber].variables, ctx.globalVars);
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