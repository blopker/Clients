var db = require('../db'),
    config = require('../config');

function User(username, pass, root, admin) {
    this.id = username;
    this.pass = pass;
    this.root = root || '/';
    this.admin = admin || false;
    return this;
}

User.prototype.isAdmin = function() {
    return this.admin;
};

function create (username, pass, root, admin) {
    var user = new User(username, pass, root, admin);
    db.set('users', username, user);
    return user;
}

function get (username, cb) {
    cb(null, db.get('users', username));
}

exports.get = get;
exports.create = create;
