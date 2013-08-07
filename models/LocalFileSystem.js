var fs = require('fs'),
    Folder = require('../models/Folder'),
    File = require('../models/File'),
    async = require('async');

function files_to_paths(root, files) {
    return files.map(function(file) {return root + file;});
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function populate_folder(folder, paths, cb) {
    async.map(paths, fs.stat, function(err, results) {
        if (err) {
            return cb(err, null);}
        for (var i = 0; i < paths.length; i++) {
            folder.add_file(new File(paths[i], results[i]));
        }
        return cb(null, folder);
    });
}

function get_folder(path, cb){
    try{
        path = fs.realpathSync(path) + '/';
    } catch(err) {
        return cb(err, null);
    }
    var folder = new Folder(path);

    fs.readdir(path, function(err, files) {
        if (err) {return cb(err, []);}
        var paths = files_to_paths(path, files);

        populate_folder(folder, paths, function(err, folder) {
            if (err) {return cb(err, null);}
            return cb(null, folder);
        });
    });
}

function get_file (res, path, cb) {
    fs.stat(path, function(err, stat) {
        if(err){return cb(err);}
        if (stat.isFile()) {
            return res.download(path);
        } else {
            return cb("Not a file.");
        }
    });
}

exports.get_folder = get_folder;
exports.get_file = get_file;
