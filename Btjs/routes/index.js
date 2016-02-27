var url = require('url');
var sprintf = require('sprintf');
var async = require('async');
var logger = global.__logService;
var underscore = require('underscore');
var parseTools = require("./parseTools");


exports.index = function(req, res){
    var logger = global.__logService;
    //指定关注的track_list
    var dbName = "dawei_localhost";
    selectTrackInfoFromDB(dbName,function(err,trackInfos){
        logger.debug(JSON.stringify(trackInfos));
        async.mapSeries(
            trackInfos,
            function(trackInfo,mapcallback){
                selectTracklistFromDB(dbName,trackInfo.trackUrl,function(err,trackDetails){
                    logger.debug(JSON.stringify(trackDetails));
                    trackInfo.details = trackDetails;
                    mapcallback();
                })
            },
            function(errs,resList){
                if(errs){
                    logger.error(errs);
                } else{
                    res.render('', {
                        title: '番剧更新详情',
                        layout: 'index',
                        data :trackInfos
                    })
                }
            }
        );
    });
};



function selectTracklistFromDB(dbName,trackUrl,callback){
    var logger = global.__logService;
    var sql=sprintf("SELECT * FROM %s.TrackDetails WHERE trackUrl = '%s' ORDER BY listOrder DESC;",dbName,trackUrl);
    /* execute sql */
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

function selectTrackInfoFromDB(dbName,callback){
    var logger = global.__logService;
    var sql=sprintf("SELECT * FROM %s.TrackInfo;",dbName);
    /* execute sql */
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