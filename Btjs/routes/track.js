var url = require('url');
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var sprintf = require('sprintf');
var async = require('async');
var logger = global.__logService;
var parseTools = require("./parseTools");
var underscore= require('underscore');
/*
 * GET track page
 */

exports.index = function(req, res){
    //指定关注的track_list
    var dbName = "dawei_localhost";
    async.waterfall(
        [
            //step1 get tracklist from db
            function(cb){
                selectTracklistFromDB(dbName,function(err,tracklist){
                    cb(err,tracklist);
                });
            },

            //step2 sync pull info
            function(tracklist,cb){
                //use eventproxy 并发抓取：
                var urls = underscore.pluck(tracklist,"trackUrl");
                var ep = new eventproxy();
                ep.after("eventName",urls.length,function(urlResults){
                    cb(null,urlResults);
                });
                urls.forEach(function(url){
                    superagent.get(url)
                        .end(function(err,urlRes){
                            ep.emit("eventName",[url,urlRes.text])
                        });
                });

            },
            //step3 deal and store info
            function(resResults,cb){
                async.mapSeries(
                    resResults,
                    function(result,mapcallback){
                        var url = result[0];
                        var $ = cheerio.load(result[1]);
                        //根据url来源不同，jquery处理方式也有不同
                        if(url.indexOf("www.youku.com")>-1){
                            //通过jquery方式获取内容链接
                            var insertList = [];
                            $('#episode ul li a').each(function(idx,element){
                                var $element = $(element);
                                var title = $element.attr('title');  //标题
                                var href = $element.attr('href');//链接
                                var num = $element.text();//序号
                                var insertInfo = {
                                    trackUrl:url,
                                    trackResult:title,
                                    resultUrl:href,
                                    listOrder:num
                                };
                                logger.debug(JSON.stringify(insertInfo));
                                insertList.push(insertInfo);
                            });
                            logger.debug(JSON.stringify(insertList));
                            restoreIntoDB(dbName,insertList,function(err,result){
                                logger.trace("err="+err);
                                logger.debug("result="+result);
                                mapcallback(null,200);
                            });

                        }else if (url.indexOf("www.iqiyi.com")>-1){
                            var titlePreffix = $('#block-D .main_title a').text();
                            var insertList = [];
                            $('#block-I  ul li p a').each(function(idx,element){
                                var $element = $(element);
                                var titleSuffix = $element.text();  //标题
                                logger.debug(titleSuffix=="");
                                if(titleSuffix==""){
                                }else{
                                    var href = $element.attr('href');//链接
                                    var numStr = $element.attr('rseat').split("_")[2];//序号
                                    var insertInfo = {
                                        trackUrl:url,
                                        trackResult:titlePreffix+titleSuffix,
                                        resultUrl:href,
                                        listOrder:Number(numStr)
                                    };
                                    logger.debug(JSON.stringify(insertInfo));
                                    insertList.push(insertInfo);
                                }
                            });

                            restoreIntoDB(dbName,insertList,function(err,result){
                                logger.trace("err="+err);
                                logger.debug("result="+result);
                                mapcallback(null,200);
                            })
                        }else{
                            logger.trace("enter null");
                            mapcallback(null,200);
                        }
                    },
                    function(errs,results){
                        cb(errs,results)
                    }

                );
            }
        ]
        ,function(errlist,results){
            if(errlist){
                logger.error(errlist);
            }else{
                logger.debug(JSON.stringify(results));
                //res.render('',{
                //    title: '番剧更新详情：',
                //    layout: 'index',
                //    data :{}
                //});
                res.redirect("/#profile");
            }
        }
    );


};

function selectTracklistFromDB(dbName,callback){
    var sql=sprintf("SELECT * FROM %s.TrackInfo WHERE enable = 1;",dbName);
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
function restoreIntoDB(dbName,insertInfos,callback){

    var insertDataArray=[];
    var data = {};
    underscore.map(insertInfos,function(item){
        var obj = parseTools.parseInsertOnDuplicateInfo(item);
        data.keyStr = obj.keyStr;
        data.updateStr = obj.updateStr;
        insertDataArray.push(underscore.values(item));
    });
    var sql=sprintf("INSERT INTO %s.TrackDetails (%s) VALUES ? ON DUPLICATE KEY UPDATE %s;",dbName,data.keyStr,data.updateStr);
    /* execute sql */
    __mysql.query(sql, [insertDataArray],function(err, results){
        if (err) {
            logger.error("error : " + err + ", " + err.stack);
            callback(err);
        }else{
            callback(err,results);
        }
    });
}