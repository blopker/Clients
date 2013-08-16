var local_fs = require('../models/LocalFileSystem');

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
    var path = req.params.file || '';
    if(path.search(/\.\.\//) !== -1){
        return null;
    }
    return path;
}

function browse_folder (req, res) {
    var path = validate(req, res);
    if(path === null){
        return res.redirect('/files/');
    }

    res.locals.crumb = make_breadcrumb(path);

    // Add user's root to path for the file system.
    var fs_path = req.user.root + '/' + path;

    local_fs.get_folder(fs_path, function(err, folder) {
        if (err) {
            res.redirect('/files/');
        } else {
            res.render('files', {folder: folder});
        }
    });
}

function get_file (req, res) {
    var path = validate(req, res);
    if(path === null){
        return res.redirect('/files/');
    }

    // Add user's root to path for the file system.
    var fs_path = req.user.root + '/' + path;

    local_fs.get_file(res, fs_path, function() {
        // Maybe it's a folder.
        res.redirect('/files/' + path + '/');
    });
}

exports.get_file = get_file;
exports.browse_folder = browse_folder;
exports.validate = validate;
