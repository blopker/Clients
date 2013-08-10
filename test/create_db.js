var async = require('async');

function getUser (name) {
    return { name: name,
            password: 'pass',
            root: '/tmp',
            admin: false };
}

var bo = { name: 'bo',
            password: 'pass',
            root: '/home/ninj0x/Downloads',
            admin: true };

function user_factory (db, count) {
    function user_temp (user) {
        return function(call) {
            db.User.findOrCreate(user)
            .complete(call);
        };
    }

    var func = [];
    func.push(user_temp(bo));
    func.push(user_temp(getUser('tommy')));
    for (var i = 0; i < count; i++) {
        var user = getUser('tommy' + i);
        func.push(user_temp(user));
    }
    return func;
}

function add_data (db, cb) {
    async.series(user_factory(db, 10),
    function(err) {
        if (err) {throw err;}
        cb();
    });
}

function init (cb) {
    var Sequelize = require('sequelize-sqlite').sequelize;

    var sequelize = new Sequelize('database', 'username', null,{
        // sqlite! now!
        dialect: 'sqlite',

        // the storage engine for sqlite
        // - default ':memory:'
        storage: 'dev.sqlite'
    });

    var db = {
        types: Sequelize,
        model: sequelize,
        User:  sequelize.import(__dirname + '/../models/User')
    };

    sequelize.drop().success(function() {
        sequelize.sync().success(function() {
            add_data(db, function() {
                cb(db);
            });
        });
    });

}

module.exports = init;

if (!module.parent) {
    init(function() {
        console.log('database ready.');
    });
}
