
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.secret = function(req, res) {
    console.log(req.user);
    console.log(req.params);
    res.end('u has secret');
};
