var bo = { name: 'bo',
            password: 'pass',
            root: './test/test_files',
            admin: true };

function make_tommy (jersey_number) {
    var name = 'tommy';
    if (jersey_number !== 0) {
        name += jersey_number;
    }
    return { name: name,
        password: 'pass',
        root: '/tmp',
        admin: false };
}

function make_users (count) {
    var users = [];
    users.push(bo);
    for (var i = 0; i < count; i++) {
        users.push(make_tommy(i));
    }
    return users;
}

function init (cb) {
    var Sequelize = require('sequelize');

    var sequelize = new Sequelize('database', 'username', null,{
        dialect: 'sqlite',
        storage: 'dev.sqlite',

        logging: false
    });

    var db = {
        types: Sequelize,
        model: sequelize,
        User:  sequelize.import(__dirname + '/../models/User')
    };

    sequelize.drop().success(function() {
        sequelize.sync().success(function() {
            db.User.bulkCreate(make_users(10))
                .success(function() {
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
