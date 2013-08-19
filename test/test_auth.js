require('../app')(function(app) {
    var request = require('supertest');

    describe('Auth', function() {
        before(function(done) {
            require('./create_db')(function() {
                done();
            });
        });

        describe('Login Page', function() {
            it('should show login page', function(done) {
                request(app)
                    .get('/login')
                    .expect(200)
                    .expect(/login-form/)
                    .end(function(err) {
                        if (err) {throw err;}
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
                    .end(function(err) {
                        if (err) {throw err;}
                        done();
                    });
            });
        });

        describe('Bad Login', function() {
            var tommy = request.agent(app);
            it('should redirect to login and show message.', function(done) {
                tommy.post('/login')
                    .send({username:'not a user', password: 'pass'})
                    .expect(302)
                    .expect('Location', '/login')
                    .end(function(err, res) {
                        if (err) {throw err;}
                        tommy.get('/login')
                            .set('Cookie', res.header['set-cookie'])
                            .expect(/Invalid/)
                            .end(function(err) {
                                if (err) {throw err;}
                                done();
                            });
                    });
            });
        });

        describe('Bad Password', function() {
            var tommy = request.agent(app);
            it('should redirect to login and show message.', function(done) {
                tommy.post('/login')
                    .send({username:'tommy', password: 'not the right one'})
                    .expect(302)
                    .expect('Location', '/login')
                    .end(function(err, res) {
                        if (err) {throw err;}
                        tommy.get('/login')
                            .set('Cookie', res.header['set-cookie'])
                            .expect(/Invalid/)
                            .end(function(err) {
                                if (err) {throw err;}
                                done();
                            });
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
                    .end(function(err) {
                        if (err) {throw err;}
                        done();
                    });
            });

            it('should allow access to files after logging in', function(done) {
                tommy.get('/files/')
                    .expect(200)
                    .end(function(err) {
                        if (err) {throw err;}
                        done();
                    });
            });

            it('should not allow access to admin for users', function(done) {
                tommy.get('/admin')
                    .expect(302)
                    .end(function(err) {
                        if (err) {throw err;}
                        done();
                    });
            });
        });

        describe('Login admin', function() {
            var bo = request.agent(app);
            it('should let admins login', function(done) {
                bo.post('/login')
                    .send({username:'Bo', password: 'pass'})
                    .expect(302)
                    .expect('Location', '/')
                    .end(function(err) {
                        if (err) {throw err;}
                        done();
                    });
            });

            it('should allow access to admin for admins', function(done) {
                bo.get('/admin')
                    .expect(200)
                    .end(function(err) {
                        if (err) {throw err;}
                        done();
                    });
            });
        });
    });
});
