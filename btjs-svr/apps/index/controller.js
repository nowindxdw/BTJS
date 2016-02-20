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
 * index/controller.js
 *
 */

module.exports=function(app) {

    /*
     * Services
     */
    var logger = __logService;
    var db = __dbService;
    var dataService = __dataService;

    /*
     * load 3rd party modules
     */
    var path = require('path');
    var underscore = require("underscore");
    var sprintf = require("sprintf-js").sprintf;
    var fs = require('fs');
    var hasher = require('password-hash-and-salt');

    /*
     * load project modules
     */
    var auth = require(__base + '/modules/auth');
    var feedback = require(__modules_path + "/feedback");
    var FBCode = feedback.FBCode;
    var FeedBack = feedback.FeedBack;
    var model = require('./model')();
    /*
     * init app name etc
     */
    var APPNAME = __dirname.split(path.sep).pop();
    var APPURL = "/";
    logger.trace("Initiating APP:[" + APPNAME + "]@" + APPURL);

    /*
     * load module
     */

    /*
     * Set url mapping handlers, used in this app
     * URL mapping in this APP, app.HTTP_METHOD(URL, auth, handler) format
     */
    app.get("/", getIndexHandler);


    /**
     * getIndexHandler
     *      handler for HTTP GET index
     * @param req
     * @param res
     * @param next
     */
    function getIndexHandler(req, res, next) {
        logger.enter();
        logger.debug("enter index");
        res.json("OK");
        return;
    }
};