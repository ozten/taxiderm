confirmNewProjectController = function() {
    var that = controller();

    that.setup = function() {
        $('#confirm-new-project .cancel').bind('click', function(e) {
            e.preventDefault();
            changePage('#homepage');
            //return false;
        });
        $('#confirm-new-project').bind('submit', function(e) {
            e.preventDefault();
            projectName.setValue($('#project-name').val());
            changePage('#template-pool');
        });
    };
    that.tearDown = function () {
      $('#confirm-new-project .cancel').unbind('click');
      $('#confirm-new-project .cancel').unbind('submit');
      console.log('tearDown called');
    };
    return that;
};