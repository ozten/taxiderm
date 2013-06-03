var gui = require('nw.gui'),
    path = require('path'),
    fs = require('fs');


var controllers = {}
var previousPage = '#homepage';
/*** Framework ***/
function changePage(pageId) {
    if (! controllers[pageId]) {
        console.log(pageId);
        console.error(new Error('Unknown pageId=' + pageId));
        return;
    }
    if (controllers[previousPage] && controllers[previousPage].tearDown) {
        controllers[previousPage].tearDown();
    }
    previousPage = pageId;
    $('.page').hide();
    $(pageId).show();
    if (controllers[pageId] && controllers[pageId].setup) {
        controllers[pageId].setup();
    }
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

// TODO hardcoded knowlege
var staticRoot = "static";
var templateRoot = "server/views";


var projectDir = '';


// Each .ejs or other template file we find on the file system
var templatePaths; // Model

// Each Previewable Screen the user creates and configures
var previewableScreens; // Model


var cbCounter = 0;
function loadDirectory(dir, cb) {
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
                    loadDirectory(fullpath, cb);
                } else if (stats.isFile()) {
                    cbCounter++;
                    isTemplate(fullpath, function(err, wasFile, templatePath) {
                        cbCounter--;
                        if (wasFile) {
                            var relTemplatePath = templatePath.substring(projectDir.length );
                            templatePaths.pushValue(relTemplatePath);
                            $('.chooseProjecttemplateList').append("<li>" + relTemplatePath + "</li>");
                        }
                        if (0 === cbCounter) {
                            projectName.setValue(path.basename(projectDir));
                            cb(null);
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
        if (projectDir[projectDir.length - 1] != '/') {
            project += '/';
        }
        loadDirectory(projectDir, function(err){
            changePage('#confirm-new-project');
        });
    });
}

// User friendly name of current Project
var projectName; // Model

var confirmNewProject; // View
var taxidermyController; // Controller

var previewScreenName; // Model
var previewScreenTemplate; // Model

$(document).ready(function(){
    taxidermyController = controller();

    projectName = model('projectName', '', taxidermyController);
    templatePaths = arrayModel('templatePaths', [], taxidermyController);
    previewableScreens = arrayModel('previewableScreens', [], taxidermyController);

    confirmNewProject = view('#confirm-new-project',
                                 'confirm_new_project',
                                 {projectName: projectName});

    controllers['#confirm-new-project'] = confirmNewProjectController();
    controllers['#confirm-new-project'].addView(confirmNewProject, [projectName]);

    var homepageView = view('#homepage', 'homepage', {});
    taxidermyController.addView(homepageView, []);
    controllers['#homepage'] = taxidermyController;

    var totalNumTemplates = (function () {
        var that = model('totalNumTemplates', 0, taxidermyController);
        that.modelUpdated = function(modelId) {

            this.setValue(templatePaths.getValues().length);
        };
        return that;
    })();
    templatePaths.addListener(totalNumTemplates);

    var totalNumScreens = (function() {
        var that = model('totalNumScreens', 0, taxidermyController);
        that.modelUpdated = function(modelId) {
            this.setValue(previewableScreens.getValues().length);
        };

        return that;
    })();

    var templatePoolView = view('#template-pool', 'template_pool', {
        templatePaths: templatePaths,
        totalNumTemplates: totalNumTemplates,
        totalNumScreens: totalNumScreens
    });
    //taxidermyController.addView(templatePoolView, []);
    controllers['#template-pool'] = templatePoolController();
    controllers['#template-pool'].addView(templatePoolView, [templatePaths]);

    //taxidermyController.addView(confirmNewProject, [projectName]);

    controllers['#preview-screen'] = confirmNewProjectController();
    previewScreenName = model('previewScreenName', '', controllers['#preview-screen']);
    previewScreenTemplate = model('previewScreenTemplate', '', controllers['#preview-screen']);
    previewScreenNameView = view('#preview-screen', 'preview_screen', {
        previewScreenName: previewScreenName,
        previewScreenTemplate: previewScreenTemplate
    });
    controllers['#preview-screen'].addView(previewScreenNameView, [previewScreenName, previewScreenTemplate]);

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
    var project = lastProject();
    console.log(project);
    if (!!project) {
        projectDir = project;
        if (projectDir[projectDir.length - 1] != '/') {
            project += '/';
        }
        console.log('calling load project');
        loadProject(projectDir, function(err, json) {
            if (err) {
                console.error(err);
                alert(err);
            } else {
                // Populate models
                console.log(json);
                // AOK
                projectName.setValue(json.projectName);
                //templatePaths dynamically updated
                loadDirectory(projectDir, function () {
                    changePage('#template-pool');
                    // TODO get reveal screen to be displayed properly...
                    previewScreenName.setValue('ID Mismatch');
                    previewScreenTemplate.setValue('server/views/id_mismatch.ejs');
                    changePage('#preview-screen');
                });
                json.screens.forEach(function(screen) {
                    previewableScreens.pushValue(screen.linkTitle);
                });

            }
        });
    } else {
        // Homepage is the place to create new Projects!
        changePage('#homepage');
    }

});

var modelIdToViews = {};

function controller() {
    return {
        addView: function(view, models) {
            models.forEach(function(model) {
                if (! modelIdToViews[model.id]) {
                    modelIdToViews[model.id] = []
                }

                modelIdToViews[model.id].push(view);
            });
        },
        modelUpdated: function(modelId) {
            if (!modelIdToViews[modelId]) return;
            modelIdToViews[modelId].forEach(function(view) {

                view.refresh();
            });
        }
    }
}

var models = {};
function model(id, value, controller) {
  models[id] = value;
  var listeners = [controller];
  return {
    id: id,
    setValue: function(value) {
        models[id] = value;
        this.changed();
    },
    changed: function() {
        listeners.forEach(function(listener) {
        listener.modelUpdated(id, this);
        });
    },
    getValue: function() {
        return models[id];
    },
    addListener: function(listener) {
        console.log('BEFORE');
        console.log(listeners);

        listeners.push(listener);

        console.log('becomes');
        console.log(listeners);
    }
  };
}

function arrayModel(id, values, controller) {
    var that = model(id, values, controller);
    that.setValue = function(key, value) {
        models[id][key] = value;
        that.changed();
    };
    that.getValue = function(key) {
        return models[id][key];
    };
    that.getValues = function() {
        return models[id];
    }
    that.pushValue = function(value) {
        models[id].push(value);
        that.changed();
    }
    return that;
}

function view(domId, template, data) {
    var data = data || {};
    if ($(domId).length !== 1) throw new Error('index.html is missing <div id="' + domId.substring(1) + '"></div>');
    var templateSrc = fs.readFileSync(path.join('nw', 'views', template + '.mustache'), 'utf8');
    $(domId).replaceWith(Mustache.render(templateSrc, data));

    return {
        id: domId,
        refresh: function() {
            var params = {};
            Object.keys(data).forEach(function(key) {
            // Array Models
                if (!! data[key].getValues) {
                    params[key] = data[key].getValues();

                } else {

                    params[key] = data[key].getValue();
                }

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


// TODO read package.json and use toolbar = true to contol this:

      var win = gui.Window.get();
      win.showDevTools();//.requestAttention(true);
/*

*/