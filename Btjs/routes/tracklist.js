
var url = require('url');
var sprintf = require('sprintf');
var async = require('async');
var logger = global.__logService;
var underscore = require('underscore');
var parseTools = require("./parseTools");
/*
 * GET track page
 */

exports.index = function(req, res){
  //指定关注的track_list
    var dbName = "dawei_localhost";
    selectTrackInfoFromDB(dbName,function(err,trackInfos){
        underscore.map(trackInfos,function(trackInfo){
            selectTracklistFromDB(dbName,trackInfo.id,function(err,trackDetails){
                trackInfo.details = trackDetails;
                res.render('', {
                    title: '正在追的各种：',
                    layout: 'layout',
                    data :trackInfo
                })
            })
        })
    });

};


function selectTracklistFromDB(dbName,trackId,callback){
    var sql=sprintf("SELECT * FROM %s.TrackDetails WHERE trackId = %d ORDER BY listOrder DESC;",dbName,trackId);
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

function selectTrackInfoFromDB(dbName,callback){
    var sql=sprintf("SELECT * FROM %s.TrackInfo;",dbName);
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