var fs = require('fs');

function browse (req, res) {
    var path = req.user.root + req.params[0];
    fs.readdir(path, function(err, files) {
        if (err) {return res.end(err);}
        res.json(files);
    });
}

exports.browse = browse;
