


var url = require('url');
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var sprintf = require('sprintf');
var async = require('async');
var logger = global.__logService;
var parseTools = require("./parseTools");
/*
 * GET track page
 */

exports.index = function(req, res){
  //指定关注的track_list
    var dbName = "dawei_localhost";
    var track_list = [{name:"万万没想到",url:"http://www.youku.com/show_page/id_z10afd9027d4111e5b0dc.html"}];
    var track_obj = track_list[0];
    var targetUrl = track_obj.url;
    superagent.get(targetUrl)
        .end(function(err,result){
            var $ = cheerio.load(result.text);
            //通过jquery方式获取内容链接
            $('#episode ul li a').each(function(idx,element){
                var $element = $(element);
                var title = $element.attr('title');  //标题
                var href = $element.attr('href');//链接
                var num = $element.text();//序号
                //todo restore data into db
                var insertInfo = {
                    trackId:1,
                    trackResult:title,
                    resultUrl:href,
                    listOrder:num,
                };
                logger.debug(JSON.stringify(insertInfo));
                restoreIntoDB(dbName,insertInfo,function(err,result){
                    logger.trace("err="+err);
                    logger.debug("result="+result);

                })

            });
        });
  //res.redirect('','/track/list');
  res.render('', { title: '正在追的各种：',
                   layout: 'layout',
                   data:{}})
};


function restoreIntoDB(dbName,insertInfo,callback){
    var data = parseTools.parseInsertOnDuplicateInfo(insertInfo);
    var sql=sprintf("INSERT INTO %s.TrackDetails (%s) VALUES (%s) ON DUPLICATE KEY UPDATE %s;",dbName,data.keyStr,data.valueStr,data.updateStr);
    logger.sql(sql);
    /* execute sql */
    __mysql.query(sql, function(err, results){
        if (err) {
            logger.error("error : " + err + ", " + err.stack);
            callback(err);
        }else{
            callback(err,results);
        }
    });
}
//use eventproxy 并发抓取：
//var ep = new eventproxy();
//ep.after("eventName",urls.length,funciton(getResults)){
//
//}
//urls.forEach(function(url){
//    superagent.get(url)
//        .end(function(err,urlRes){
//           ep.emit("eventName",[url,urlRes.text])
//        });
//});