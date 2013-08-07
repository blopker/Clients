var assert = require('assert'),
    fs = require('../models/LocalFileSystem');

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
        fs.get_folder('/not_a_real_file', function(err, folder) {
            assert(err !== null);
            done();
        });
    });
});

