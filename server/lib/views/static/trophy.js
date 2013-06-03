if (! window.$) {
    var j=document.createElement('script');
    j.src='/vendor/js/vendor/jquery.js';
    document.documentElement.appendChild(j);
}

setTimeout(function () {
var t = '<a id="taxidermtrophy" style="position: absolute; top: 45%; right: 0px; z-index: 666; width: 151px; height: 214px;" href="/"><img style="display: none;" src="/logo_sketch.png" /></a>';
$('body').append(t);

var hideTimeout;
$('#taxidermtrophy').mouseover(function(e) {
  clearTimeout(hideTimeout);
  $('#taxidermtrophy img').show('slow');
});
$('#taxidermtrophy img').mouseover(function(e) {
  clearTimeout(hideTimeout);
});
$('#taxidermtrophy').mouseout(function(e) {
  hideTimeout = setTimeout(function() {
    $('#taxidermtrophy img').hide('fast');
  })
});
}, 1000);