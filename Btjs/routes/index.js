var url = require('url');
var sprintf = require('sprintf');
var async = require('async');
var logger = global.__logService;
var underscore = require('underscore');
var parseTools = require("./parseTools");


exports.index = function(req, res){

    //指定关注的track_list
    var dbName = "dawei_localhost";
    selectTrackInfoFromDB(dbName,function(err,trackInfos){
        underscore.map(trackInfos,function(trackInfo){
            selectTracklistFromDB(dbName,trackInfo.id,function(err,trackDetails){
                trackInfo.details = trackDetails;
                res.render('', {
                    title: '番剧『'+trackInfo.trackName+'』更新详情：',
                    layout: 'index',
                    data :trackInfo
                })
            })
        })
    });
};



function selectTracklistFromDB(dbName,trackId,callback){
    var sql=sprintf("SELECT * FROM %s.TrackDetails WHERE trackId = %d ORDER BY listOrder DESC;",dbName,trackId);
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