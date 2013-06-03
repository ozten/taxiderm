templatePoolController = function() {
    var that = controller();
    that.setup = function() {
        // TODO why is this blank???
        $('#template-pool div').show();


        $('#create-preview-screen').click(function(e) {
            // Foundation reveal will handle showing dialog

        });
        $('#create-preview-screen-dialog-save').click(function(e) {
            e.preventDefault();
            $('#create-preview-screen-dialog').foundation('reveal', 'close');

            previewScreenName.setValue($('#crt-preview-screen-name').val());
            previewScreenTemplate.setValue($('#crt-preview-screen-template-name').val()); // Model

            changePage('#preview-screen');


        });
        $('#create-preview-screen-dialog-cancel').click(function(e) {
            e.preventDefault();
            $('#create-preview-screen-dialog').foundation('reveal', 'close');
        });
    };
    that.tearDown = function() {

    };
    return that;
};