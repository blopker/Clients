var local_fs = require('../models/LocalFileSystem');

function sanitize_path (path) {
    if(path.search(/\.\.\//) !== -1){
        return false;
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

function browse (req, res) {
    var path = sanitize_path(req.params[0]);
    if (path === false) {
        // Redirect on bad behaviour.
        return res.redirect('/files/');
    }

    res.locals.crumb = make_breadcrumb(path);
    console.log(res.locals.crumb);

    // Add user's root to path for the file system.
    var fs_path = req.user.root + '/' + path;

    local_fs.get_path(res, fs_path);
}

exports.browse = browse;
exports.sanitize_path = sanitize_path;
