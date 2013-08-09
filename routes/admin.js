var User = require('../db').User;

exports.list = function(req, res){
    User.findAll().success(function(users) {
        res.render('admin', {users: users});
    });
};

exports.update = function(req, res) {

};

exports.add = function(req, res) {};

exports.delete = function(req, res) {};
