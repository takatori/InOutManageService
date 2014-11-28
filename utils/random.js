exports.select = function (array) {
    var len = array.length;
    var i = Math.floor( Math.random() * len);
    return array[i];
};