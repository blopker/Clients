var local_fs = require('../models/LocalFileSystem');

function browse (req, res) {
    var path = req.user.root + req.params[0];

    local_fs.get_folder(path, function(err, folder) {
        if(err){return res.send(404);}
        res.render('files', {folder: folder});
    });
}

exports.browse = browse;

