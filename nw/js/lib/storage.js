var fs = require('fs'),
    path = require('path');

// TODO localStorage for last loaded taxidery.json
var lastProject = function() {return '/Users/shout/Projects/bigtent/' };

var loadProject = function(projectDir, cb) {
  fs.readFile(path.join(projectDir, '.taxidermy'),
        function(err, data) {
            if (err) return cb(err)
            try {
                var projectData = JSON.parse(data.toString('utf8'));
                cb(null, projectData);
            } catch (e) {
                cb(e);
            }

        });
};