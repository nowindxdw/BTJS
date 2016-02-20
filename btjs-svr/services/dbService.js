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
 * database service
 *
 * 修订历史：
 * -----------------------------------------------------------------------------
 * 2015-09-18    hc-romens@issue#22
 *
 */
module.exports=function() {

    /**
     * system service handles
     */
    var logger = global.__logService;

    /**
     * 3rd party modules
     */
    var sprintf = require("sprintf-js").sprintf;
    var underscore = require("underscore");

    var INTERVALTIME = 100;

    /**
     * DB Service provider
     */
    var dbService = {

        /**
         * getConnection
         *      A wrapper method to obtain a DB connection
         * @param callback
         */
        getConnection: function (callback) {
            logger.enter();
            __mysql.getConnection(function (err, connect) {
                if (err) {
                    logger.sqlerr(err);
                    throw err;
                }

                callback(connect);
            });
        },

        /**
         * endConnection
         *      A wrapper method to end a DB connection
         * @param connect
         * @param callback
         */
        endConnection: function(connect) {
            logger.enter();
            connect.release();
        },

        /**
         * beginTrans
         *      A wrapper methods for Begin Transaction
         *
         * WARNING: Nested transaction is not supported by MySQL. This method doesn't check multiple entries!!!
         *
         * @param callback, callback has a param: connect
         */
        beginTrans: function (callback) {
            logger.enter();

            this.getConnection(function (connect) {

                connect.beginTransaction(function (err) {
                    if (err) {
                        logger.sqlerr(err);
                    }
                    callback(connect);
                });
            });
        },

        /**
         * commitTrans
         *      A wrapper method for commit transaction
         * @param connect
         * @param callback
         */
        commitTrans: function (connect, callback) {
            logger.enter();
            connect.commit(function (err) {

                if (err) {
                    logger.sqlerr(err);
                }
                dbService.endConnection(connect);
                callback(err);
            });

        },

        /**
         * rollbackTrans
         *      A wrapper method for rollback transaction
         * @param connect
         * @param callback
         */
        rollbackTrans: function (connect, callback) {
            logger.enter();
            connect.rollback(function() {
                dbService.endConnection(connect);
                callback();
            });
        }
    };

    dbService = underscore.extend(dbService, require(__dirname + "/db/public.js"));
    dbService = underscore.extend(dbService, require(__dirname + "/db/cloud/customer.js")());
    dbService = underscore.extend(dbService, require(__dirname + "/db/customer/operator.js")());
    return dbService;
};
