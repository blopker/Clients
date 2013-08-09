module.exports = function(db, types) {
    var name = {
        type: types.STRING,
        primaryKey: true,
        allowNull: false,
        validate:{
            isAlphanumeric: {
                msg: 'Username must be alphanumeric.'
            },
            len: {
                args: [[2, 100]],
                msg: 'Username must be between 2 and 100 characters.'
            }
        },
        set: function(name) {
            return this.setDataValue('name', name.toString().toLowerCase());
        }
    };

    var password = {
        type: types.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [[5, 100]],
                msg: 'Password must be between 5 and 100 characters.'
            }
        }
    };

    var root = {
        type: types.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [[1, 100]],
                msg: 'Root path cannot be empty.'
            }
        }
    };

    var admin = {
        type: types.BOOLEAN,
        defaultValue: false,
        allowNull: false
    };

    var instanceMethods = {
        isAdmin: function() {
            return this.admin;
        },
        is: function(username) {
            return this.id === username.toLowerCase();
        }
    };

    var classMethods = {
        get: function(username, cb) {
            this.find({where: {name: username}})
            .success(function(user) {
                cb(null, user);
            }).error(function(err) {
                cb(err, null);
            });
        }
    };

    return db.define('User', {
        name: name,
        password: password,
        root: root,
        admin: admin
    }, {
        instanceMethods: instanceMethods,
        classMethods: classMethods
    });
};
