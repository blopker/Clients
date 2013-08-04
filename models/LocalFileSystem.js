var fs = require('fs'),
    Folder = require('../models/Folder'),
    File = require('../models/File'),
    async = require('async');

function files_to_path (root, files) {
    return files.map(function(file) {return root + file;});
}

function populate_folder (folder, paths, cb) {
    async.map(paths, fs.stat, function(err, results) {
        if (err) {return cb(err, []);}
        for (var i = 0; i < paths.length; i++) {
            folder.add_file(new File(paths[i], 'dunno', results[i]));
        }
        return cb(null, folder);
    });
}

function sanitize_path (path) {
    // Make sure folders end with /
    if (path.lastIndexOf('/') !== path.length -1) {path += '/';}
    path = path.replace('../', '');
    return path;
}

function get_folder(path, cb){
    path = sanitize_path(path);

    var folder = new Folder(path);
    fs.readdir(path, function(err, files) {
        if (err) {return cb(err, []);}
        var paths = files_to_path(path, files);
        populate_folder(folder, paths, function(err, folder) {
            if (err) {return cb(err, []);}
            return cb(null, folder);
        });
    });
}

exports.get_folder = get_folder;
