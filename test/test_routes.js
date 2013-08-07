var app = require('../app'),
    request = require('supertest'),
    validate = require('../routes/file_system').validate,
    assert = require('assert');

describe('Index', function() {
    it('should return HTML', function(done) {
        request(app)
          .get('/')
          .expect('Content-Type', /html/)
          .expect(200)
          .end(function(err, res){
            if (err) throw err;
            done();
          });
    });
});

describe('Auth', function() {
    describe('Login Page', function() {
        it('should show login page', function(done) {
            request(app)
                .get('/login')
                .expect(200)
                .expect(/login-form/)
                .end(function(err, res) {
                    if (err) throw err;
                    done();
                });
        });
    });

    describe('Restricted page', function() {
        it('should redirect to login when not logged in', function(done) {
            request(app)
                .get('/files/')
                .expect(302)
                .expect('Location', '/login')
                .end(function(err, res) {
                    if (err) throw err;
                    done();
                });
        });
    });

    describe('Login user', function() {
        var tommy = request.agent(app);
        it('should redirect to index after login', function(done) {
            tommy.post('/login')
                .send({username:'tommy', password: 'pass'})
                .expect(302)
                .expect('Location', '/')
                .end(function(err, res) {
                    if (err) throw err;
                    done();
                });
        });

        it('should allow access to files after logging in', function(done) {
            tommy.get('/files/')
                .expect(200)
                .end(function(err, res) {
                     if (err) throw err;
                     done();
                });
        });

        it('should not allow access to admin for users', function(done) {
            tommy.get('/admin')
                .expect(302)
                .end(function(err, res) {
                     if (err) throw err;
                     done();
                });
        });
    });

    describe('Login admin', function() {
        var bo = request.agent(app);
        it('should let admins login', function(done) {
            bo.post('/login')
                .send({username:'bo', password: 'pass'})
                .expect(302)
                .expect('Location', '/')
                .end(function(err, res) {
                    if (err) throw err;
                    done();
                });
        });

        it('should allow access to admin for admins', function(done) {
            bo.get('/admin')
                .expect(200)
                .end(function(err, res) {
                     if (err) throw err;
                     done();
                });
        });
    });
});

describe('Files', function() {
    describe('Browse', function() {
        var req = {params:{}};
        it('should return null if ../ in path', function() {
            req.params.file = '/bin/../';
            var san_path = validate(req);
            assert.equal(san_path, null);
        });

        it('should return path if ../ not in path', function() {
            req.params.file = '/bin/';
            var san_path = validate(req);
            assert.equal(san_path, '/bin/');
        });

        it('should return path if ../ not in path', function() {
            req.params.file = '/bi..n/';
            var san_path = validate(req);
            assert.equal(san_path, '/bi..n/');
        });
    });
});
