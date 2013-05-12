var gui = require('nw.gui'),
    path = require('path'),
    fs = require('fs');

/*** Framework ***/
function changePage(pageId) {
    $('.page').hide();
    $(pageId).show();
}

/*** Homepage ***/

function isTemplate(file, cb) {
    var parts = file.split('.');
    var last = parts.length -1;

    var templates = ['ejs'];

    if (templates.indexOf(parts[last]) >= 0) {
        cb(null, true, file);
    } else {
        cb(null, false);
    }
}
var projectDir = '';
var cbCounter = 0;
var templatePaths = [];

function loadDirectory(dir) {
    cbCounter++;
    fs.readdir(dir, function(err, files) {
        cbCounter--;
        if (err) {
            console.error(err);
            return;
        }
        files.forEach(function(file, i) {
            var fullpath = path.join(dir, file);
            cbCounter++;
            fs.stat(fullpath, function(err, stats) {
                cbCounter--;
                if (err) {
                    console.error(err);
                    return;
                }
                if (stats.isDirectory()) {
                    var ignoreDirs = ['node_modules', '.git'];
                    if (ignoreDirs.indexOf(files) >= 0) {
                        console.log("Skipping node_modules");
                    }
                    loadDirectory(fullpath);
                } else if (stats.isFile()) {
                    cbCounter++;
                    isTemplate(fullpath, function(err, wasFile, templatePath) {
                        cbCounter--;
                        if (wasFile) {
                            var relTemplatePath = templatePath.substring(projectDir.length + 1);
                            templatePaths.push(relTemplatePath);
                            $('.chooseProjecttemplateList').append("<li>" + relTemplatePath + "</li>");
                        }
                        if (0 === cbCounter) {
                            projectName.setValue(path.basename(projectDir));
                            changePage('#confirm-new-project');
                        }
                    });
                }
            });
        });

    });
}

function chooseFile(name) {
    var chooser = $(name);
    chooser.trigger('click');
    chooser.change(function(evt) {
        projectDir = $(this).val();
        loadDirectory(projectDir);
    });
}

var projectName; // Model
var confirmNewProject; // View
var taxidermyController; // Controller

$(document).ready(function(){
    taxidermyController = controller();

    projectName = model('projectName', '', taxidermyController);

    confirmNewProject = view('#confirm-new-project',
                                 'confirm_new_project',
                                 {projectName: projectName});

    var homepageView = view('#homepage', 'homepage', {});
    taxidermyController.addView(homepageView, []);

    var templatePoolView = view('#template-pool', 'template_pool', {});
    taxidermyController.addView(templatePoolView, []);

    taxidermyController.addView(confirmNewProject, [projectName]);

    $('#chooseProjectFolderLink').click(function(e) {
      e.preventDefault();
      chooseFile('#chooseProjectFolderDialog');
    });

    $('.preview-url-feedback').hide();

    $('.preview-url-copy').click(function(e) {
        e.preventDefault();
        var clipboard = gui.Clipboard.get();
        clipboard.set($(this).attr('href'), 'text');
        $('.preview-url-feedback').show('slow', function(){
            $('.preview-url-feedback').hide();
        });
    });

    changePage('#homepage');
});

var modelIdToViews = {};
function controller() {
    return {
        addView: function(view, models) {
            models.forEach(function(model) {
                if (! modelIdToViews[model]) {
                    modelIdToViews[model.id] = []
                }
                modelIdToViews[model.id].push(view);
            });
        },
        modelUpdated: function(modelId) {
            modelIdToViews[modelId].forEach(function(view) {
                view.refresh();
            });
        }
    }
}

var models = {};
function model(id, value, controller) {
  models[id] = value;

  return {
    id: id,
    setValue: function(value) {
        models[id] = value;
        controller.modelUpdated(id);
    },
    getValue: function() {
        return models[id];
    }
  };
}

function view(domId, template, data) {
    var data = data || {};
    var templateSrc = fs.readFileSync(path.join('nw', 'views', template + '.mustache'), 'utf8');
    $(domId).replaceWith(Mustache.render(templateSrc, data));

    return {
        id: domId,
        refresh: function() {
            var params = {};
            Object.keys(data).forEach(function(key) {
                params[key] = data[key].getValue();
            });
            $(domId).replaceWith(Mustache.render(templateSrc, params));
        }
    }
}

function render(template, data) {
    data = data || {};
    var templateSrc = fs.readFileSync(path.join('nw', 'views', template + '.mustache'), 'utf8');
    document.write(Mustache.render(templateSrc, data));
}

/*
// TODO read package.json and use toolbar = true to contol this:

      var win = gui.Window.get();
      win.showDevTools();//.requestAttention(true);

// Simulate user interaction
projectDir = '/Users/shout/Projects/bigtent';
loadDirectory(projectDir);
*/