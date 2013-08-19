var Sequelize = require('sequelize');

var sequelize = new Sequelize('database', 'username', null,{
    dialect: 'sqlite',
    storage: 'dev.sqlite'
});

var db = {
    types: Sequelize,
    model: sequelize,
    User:  sequelize.import(__dirname + '/models/User')
};

module.exports = db;
