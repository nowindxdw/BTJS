/*****************************************************************
 * 青岛雨人软件有限公司©2015版权所有
 *
 * 本软件之所有（包括但不限于）源代码、设计图、效果图、动画、日志、
 * 脚本、数据库、文档均为青岛雨人软件或其附属子公司所有。任何组织
 * 或者个人，未经青岛雨人软件书面授权，不得复制、使用、修改、分发、
 * 公布本软件的任何部分。青岛雨人软件有限公司保留对任何违反本声明
 * 的组织和个人采取法律手段维护合法权益的权利。
 *****************************************************************/

/*
 * database service module: public.js
 *
 *
 */
module.exports=function(){

    /**
     * system service handles
     */
    var logger = global.__logService;
    var db = global.__mysql;

    /**
     * 3rd party modules
     */
    var sprintf = require("sprintf-js").sprintf;
    var underscore = require("underscore");

    //var SQL_CT_SHOPPINGCART_UPDATE_BATCH="" +
    //    "INSERT INTO " +
    //    "   %s.Cart(" +
    //    "       clientId, " +
    //    "       goodsId, " +
    //    "       quantity " +
    //    "           )" +
    //    "   VALUES %s  " +
    //    "ON DUPLICATE KEY UPDATE " +
    //    "   quantity=quantity+values(quantity)";

    var SQL_PUBLIC_GET = "";
    var SQL_PUBLIC_POST = "";
    var SQL_PUBLIC_DELETE = "";
    var SQL_PUBLIC_MODIFY = "";

    /**
     * DB Service provider
     */
    var dbService = {
        ///**
        // *
        // * @param customerDB
        // * @param CartInBatch
        // * @param callback
        // */
        //updateCartInBatch:function(customerDB,CartInBatch,callback){
        //    logger.enter();
        //    var sql=sprintf(SQL_CT_SHOPPINGCART_UPDATE_BATCH,customerDB,CartInBatch);
        //    logger.sql(sql);
        //    db.query(sql,function(err,result){
        //        logger.enter();
        //        if(err){
        //
        //            logger.sqlerr(err);
        //            callback(err,"failed");
        //        }
        //        callback(null,result);
        //    })
        //},
        //
        //metaBatchInsertToCart: function (connection,customerDB,cartItems,callback ) {
        //    logger.enter();
        //    var insertItems = underscore(cartItems).map(function (item) {
        //        var tempArr = [];
        //        tempArr.push(Number(cartItems.clientId));
        //        tempArr.push(Number(item.goodsId));
        //        tempArr.push(Number(item.quantity));
        //        tempArr.push(item.remark);
        //        return tempArr;
        //    });
        //    logger.debug(JSON.stringify(insertItems));
        //    var sql = sprintf(SQL_CT_CART_BATCH_INSERT, customerDB);
        //    logger.sql(sql);
        //    connection.query(sql, [insertItems], function (err,result) {
        //        if(err) {
        //            logger.sqlerr(err);
        //            callback(err)
        //        }else{
        //            callback(err,result);
        //        }
        //    });
        //}

    };
    return dbService;
};