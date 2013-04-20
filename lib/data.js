exports.prepare = function(data) {
  Object.keys(data).forEach(function(key, i) {
    if (data[key].indexOf &&
        0 === data[key].indexOf('(function')) {
          data[key] = eval(data[key]);
    }
  });
}