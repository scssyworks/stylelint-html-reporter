module.exports = function (name) {
    name = name.replace(/[\\]/g);
    return name.substring(name.lastIndexOf('/') + 1);
}