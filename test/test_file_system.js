var assert = require('assert'),
    fs = require('../models/LocalFileSystem'),
    validate = require('../routes/file_system').validate;

describe('File System', function() {
    it('should get a folder object', function(done) {
        fs.get_folder('/bin', function(err, folder) {
            assert.equal(folder.name, 'bin');
            assert(folder.size > 0);
            assert(folder.count > 0);
            assert(folder.files.bash.stats.size > 0);
            assert(folder.files.bash.name === 'bash');
            done();
        });
    });

    it('should get a err for bad file paths', function(done) {
        fs.get_folder('/not_a_real_file', function(err) {
            assert(err !== null);
            done();
        });
    });
});


describe('File Validation', function() {
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
