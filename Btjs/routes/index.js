
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('', { title: 'Express',
                        layout: 'index'})
};