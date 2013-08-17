var Sequelize = require('sequelize');
    // sqlite3 = require('sequelize-sqlite').sqlite;

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
    User:  sequelize.import(__dirname + '/models/User')
};

module.exports = db;
