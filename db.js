var config = require('./config'),
    User = require('./models/User');

var db = {users:{}};

function init (app) {
    User.create('bo', 'pass', '/home/ninj0x/Downloads', true);
    User.create('tommy', 'pass', '/tmp');
}

function get (tableName, id) {
    return db[tableName][id];
}

function set (tableName, id, obj) {
    db[tableName][id] = obj;
}

exports.init = init;
exports.get = get;
exports.set = set;
