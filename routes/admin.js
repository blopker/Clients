var User = require('../db').User;

exports.get = function(req, res){
    User.findAll().success(function(users) {
        res.render('admin', {users: users});
    });
};


