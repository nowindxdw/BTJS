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
 * model.js
 *
 * 产品信息展示model
 * --------------------------------------------------------------
 *
 */

module.exports = function () {
    var logger = __logService;
    var db = __dbService;
    var MODELNAME = __dirname.split("/").pop();

    var underscore = require("underscore");
    var passwdEnc = require('password-hash-and-salt');
    var async = require('async');

    var feedback = require(__modules_path + "/feedback");
    var FBCode = feedback.FBCode;
    var FeedBack = feedback.FeedBack;

    logger.trace("Initiating model:[" + MODELNAME + "]");

    var model = {

        operatorLogin: function(cloudDBName, customerDBName, operatorName, password, ipaddr, callback) {

            logger.enter();

            // Step 1. 加载操作员信息
            var found = false;
            var operatorInfo = undefined;
            var customerInfo = undefined;
            async.series(
                [
                    /**
                     * 按照username搜索客户操作员资料
                     * @param done
                     */
                    function getClientOperator(done) {
                        db.loadClientOperatorInfo(customerDBName, operatorName, function(err, operatorList){
                            if (err) {
                                logger.sqlerr(err);
                                done(FBCode.DBFAILURE);
                            } else {
                                if (operatorList.length > 0) {
                                    found = true;
                                    operatorInfo = operatorList[0];
                                }
                                done();
                            }
                        });
                    },

                    /**
                     * 按username搜索商户操作员资料
                     * @param done
                     */
                    function getCustomerOperator(done) {
                        if (found) { // 已经匹配成功客户操作员，不再搜索商户操作员
                            done();
                        } else {
                            db.loadCustomerOperatorInfo(cloudDBName, customerDBName, operatorName, function (err, operatorList) {
                                if (err) {
                                    logger.sqlerr(err);
                                    done(FBCode.DBFAILURE);
                                } else {
                                    if (operatorList && operatorList.length > 0) {
                                        found = true;
                                        operatorInfo = operatorList[0];
                                        done();
                                    } else {
                                        done(FBCode.LOGINFAILURE);
                                    }
                                }
                            });
                        }
                    }
                ],

                function(err, resultList) {
                    if (err && operatorInfo===undefined) {
                        logger.error(err);//1003
                        callback(FBCode.LOGINFAILURE, operatorInfo);
                        return;
                    } else {
                        logger.ndump("operatorInfo", operatorInfo);

                        // 检查是否在禁止登录期
                        var maxLoginFailCount = __securityConfig.maxLoginFailCount;
                        var loginFailBanTime = __securityConfig.loginFailBanTime;

                        if (operatorInfo && operatorInfo.failCount>=maxLoginFailCount && operatorInfo.bannedTime<loginFailBanTime) {
                            var leftBanTime = loginFailBanTime-operatorInfo.bannedTime;
                            logger.info("Operator <" + operatorInfo.username + "> is banned in coming " +
                                leftBanTime + " seconds");
                            callback(FBCode.MAXPASSWDFAIL, leftBanTime);
                            return;
                        }

                        // 如果是商户操作员, 检查商户是否禁用
                        if (operatorInfo.operatorType === "CUSTOMER" && operatorInfo.enabled==false){
                            logger.info(operatorInfo.operatorType + " service has been stopped.");
                            callback(FBCode.CUSTOMERDISABLED);
                            return;
                        }

                        // 如果是客户操作员，检查客户是否被禁用
                        if (operatorInfo.operatorType === "CLIENT" && operatorInfo.enabled == false ) {
                            logger.info(operatorInfo.operatorType + " <" + operatorInfo.operatorName + "> is disabled!");
                            callback(FBCode.CLIENTDISABLED);
                            return;
                        }

                        // 开始验证密码
                        passwdEnc(password).verifyAgainst(operatorInfo.password, function (err, verified) {
                            if (err) {
                                logger.error(err);
                                callback(FBCode.INTERNALERROR);
                            } else {
                                logger.ndump("verified", verified);
                                var execFunc = (verified)?db.updateOperatorLoginOnSuccess:db.updateOperatorLoginOnFailure;
                                execFunc(customerDBName, operatorName, ipaddr, function (err, result) {
                                    if (err) {
                                        logger.sqlerr(err);
                                    }
                                    if (verified) {
                                        callback(FBCode.SUCCESS, operatorInfo);
                                    } else {
                                        callback(FBCode.LOGINFAILURE,
                                            "密码错误! 连续错误" + __securityConfig.maxLoginFailCount + "次后," +
                                            "账户将被锁定" + Math.floor((__securityConfig.loginFailBanTime + 59) / 60) +
                                            "分钟! 您还有" + (__securityConfig.maxLoginFailCount - (operatorInfo?operatorInfo.failCount:(__securityConfig.maxLoginFailCount+1)) - 1) + "次机会。"
                                        );
                                    }
                                });
                            }
                        });
                    }

                }
            );
        },

        retrievePortalData: function(customerDB, data,clientId, callback){
            var date = moment().format('YYYY-MM-DD HH:mm:ss');
            db.carouselRetrieveAvailable(customerDB, date, function (error, result) {
                if (error) {
                    callback(error);
                } else {
                    data.carousels = result;
                    db.newsRetrieveAvailable(customerDB, function (error, result) {
                        if (error) {
                            callback(error);
                        } else {
                            data.news = processNews(result);
                            db.showcaseRetrieveAvailable(customerDB,clientId, function (error, result) {
                                if (error) {
                                    callback(error);
                                } else {
                                    data.showcases=processShowcase(result);
                                    callback(null, data);
                                }
                            });
                        }
                    });
                }
            });
        }
    };


    return model;
};
