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

var db = [
    new User('bo', 'pass', '/', true),
    new User('tommy', 'pass', '/tmp')
];

function find(username, fn) {
    var found = null;
    db.forEach(function(user) {
        if (user.id === username) {
            found = user;
        }
    });
    return fn(null, found);
}

exports.find = find;
