var local_fs = require('../models/LocalFileSystem');

function sanitize_path (path) {
    if(path.search(/\.\.\//) !== -1){
        return null;
    }
    return path;
}

function make_breadcrumb (path) {
    var crumb = [];
    var pathArray = path.split('/');
    var link = '';
    for (var i = pathArray.length - 1; i >= 0; i--) {
        if (pathArray[i] === ''){continue;}
        var c = {
            name: pathArray[i],
            link: link
        };
        crumb.unshift(c);
        link = '../' + link;
    }
    return crumb;
}

function validate (req, res) {
    var path = req.params[0] || "";
    return sanitize_path(path);
}

function browse_folder (req, res) {
    var path = validate(req, res);
    if(path === null){
       return res.redirect('/files/');
    }

    res.locals.crumb = make_breadcrumb(path);

    // Add user's root to path for the file system.
    var fs_path = req.user.root + '/' + path;

    local_fs.get_folder(res, fs_path, function(err) {
        return res.redirect(404);
    });
}

function get_file (req, res) {
    var path = validate(req, res);
    if(path === null){
        return res.redirect('/files/');;
    }
    var fs_path = req.user.root + '/' + path;
    local_fs.get_file(res, fs_path, function(err) {
        // Maybe it's a folder.
        res.redirect('/files/' + path + '/');
    });
}

exports.get_file = get_file;
exports.browse_folder = browse_folder;
exports.sanitize_path = sanitize_path;
