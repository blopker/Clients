require('../app')(function(app) {
    var request = require('supertest');

    describe('Index', function() {
        it('should redirect', function(done) {
            request(app)
                .get('/')
                .expect(302)
                .end(function(err){
                    if (err) {throw err;}
                    done();
                });
        });
    });
});
