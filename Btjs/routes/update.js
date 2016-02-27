var url = require('url');
var sprintf = require('sprintf');
var async = require('async');
var logger = global.__logService;
var underscore = require('underscore');
exports.index = function(req, res){
  var id = req.param('id');
  var remark = req.param('remark');
  var dbName = "dawei_localhost";
  updateDetailRemark(dbName,remark,id,function(err,result){
        if(err){
            logger.error(err);
        }else{
            logger.debug(result);
        }
      res.redirect("/")
  });
};

function updateDetailRemark(dbName,remark,id,callback){
    console.log("enter update details remark");
    var remark = remark==1?"READ":"UNREAD";
    var id = Number(id);
    var sql = sprintf(" UPDATE %s.TrackDetails set remark='%s' where id= %d;",dbName,remark,id);
    logger.sql(sql);
    __mysql.query(sql, function(err, results){
        if (err) {
            logger.error("error : " + err + ", " + err.stack);
            callback(err);
        }else{
            callback(err,results);
        }
    });
}
