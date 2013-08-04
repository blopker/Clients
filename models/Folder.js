function Folder (path) {
    this.path = path;
    var pathArray = path.split('/');
    this.name = pathArray[pathArray.length - 2];
    this.size = 0;
    this.count = 0;
    this.files = {};
    return this;
}

Folder.prototype.add_file = function(file) {
    this.files[file.name] = file;
    this.count += 1;
    this.size += file.stats.size;
};

module.exports = Folder;
