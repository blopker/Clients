
function File(path, stats) {
    this.path = path;
    var pathArray = path.split('/');
    this.name = pathArray[pathArray.length - 1];
    if (stats.isDirectory()) {
        this.name += '/';
    }
    this.stats = stats;
    this.type = this.get_type(this.name, stats);
    if (this.type in this.icons) {
        this.icon = this.icons[this.type];
    } else{
        this.icon = 'page';
    }
    return this;
}

File.prototype.icons = function() {
    var v = 'video';
    var p = 'photo';
    var icons = {mp4:v, avi:v, mkv:v,
            jpg:p, jpeg:p, png:p, gif:p};
    return icons;
}();

File.prototype.get_type = function(name, stats) {
    if (stats.isDirectory()) {return 'folder';}
    if (stats.isFile) {
        return this.get_extension(name);
    }
    return 'unknown';
};

File.prototype.get_extension = function(name) {
    var nameArray = name.split('.');
    if (nameArray.length < 2) {return 'unknown';}
    return nameArray[nameArray.length - 1].toLowerCase();
};

module.exports = File;
