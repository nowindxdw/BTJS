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
 * database service module: customer.js
 *
 * 修订历史：
 * -----------------------------------------------------------------------------
 * 2015-09-25    hc-romens@issue#45
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

    /**
     * SQL for cloud DB, abbr. SQL_CL_***
     */
    var SQL_CL_CUSTOMERDB_SELECT    =
        "SELECT id AS customerId, " +
        "   customerDBSuffix," +
        "   enabled," +
        "   customerName," +
        "   businessLicense," +
        "   CASE" +
        "       WHEN businessLicenseValidateDate >= '2100-01-01 00:00:00' THEN '长期'" +
        "       ELSE DATE_FORMAT(businessLicenseValidateDate,'%%Y-%%m-%%d %%H:%%i:%%S') " +
        "   END AS businessLicenseValidateDate," +
        "   businessAddress," +
        "   legalRepresentative  " +
        "FROM " + __cloudDBName + ".Customer " +
        "WHERE subDomain='%s';";
    var SQL_CL_CUSTOMER_SELECT =
        "SELECT customerDBSuffix," +
        "       enabled," +
        "       customerName," +
        "       businessLicense," +
        "   CASE" +
        "       WHEN businessLicenseValidateDate >= '2100-01-01 00:00:00' THEN '长期'" +
        "       ELSE DATE_FORMAT(businessLicenseValidateDate,'%%Y-%%m-%%d %%H:%%i:%%S') " +
        "   END AS businessLicenseValidateDate," +
        "   businessAddress," +
        "   legalRepresentative  " +
        "FROM " + __cloudDBName + ".Customer " +
        "WHERE id=%d;";


    var SQL_CT_CUSTOMER_LOGIN_CHECK = "" +
        "SELECT " +
        "   customerName, " +
        "   enabled, " +
        "   customerDBSuffix, " +
        "   siteName, " +
        "   erpIsAvailable " +
        "FROM " +
        "   %s.Customer " +
        "where " +
        "   id = %d; ";



    /**
     * DB Service provider
     */
    var dbService = {


        loadCustomerDBInfo: function(subDomain, callback) {
            logger.enter();

            var sql = sprintf(SQL_CL_CUSTOMERDB_SELECT, subDomain);
            logger.sql(sql);

            /* execute sql */
            __mysql.query(sql, function(err, results, fields){
                if (err) {
                    logger.error("error query: " + err + ", " + err.stack);
                    callback(err);
                }else{
                    callback(err,results);
                }
            });
        },

        loadCustomer: function(customerId, callback) {
            logger.enter();

            var sql = sprintf(SQL_CL_CUSTOMER_SELECT, customerId);
            logger.sql(sql);

            /* execute sql */
            __mysql.query(sql, function(err, results, fields){
                if (err) {
                    logger.error("error query: " + err + ", " + err.stack);
                    callback(err);
                }else{
                    callback(err,results);
                }
            });
        }


    };

    return dbService;
};