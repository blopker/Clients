function File(path, stats) {
    this.path = path;
    var pathArray = path.split('/');
    this.name = pathArray[pathArray.length - 1];
    if (stats.isDirectory()) {
        this.name += '/';
    }
    this.stats = stats;
    this.type = this.get_type(this.name, stats);
    return this;
}

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
