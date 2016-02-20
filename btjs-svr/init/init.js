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
 * init.js
 *      scc's startup initialization
 *
 */


/* 3rd party modules */
var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var underscore = require('underscore');
var sprintf = require('sprintf-js').sprintf;
var async = require('async');


var compression = require('compression');
var feedback = require(__modules_path + "/feedback");
var FBCode = feedback.FBCode;
var FeedBack = feedback.FeedBack;

/**
 * Services
 **/
var logger = __logService;
var dbService = __dbService;

exports.initApp = function() {

    logger.enter();

    var app = express();

    /**
     * 启用http gzip
     */
    app.use(compression());

    /**
     * 信任http proxy, 以获取真实的的源ip地址
     */
    app.enable('trust proxy');
    // app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

    //允许跨域 //https://www.npmjs.com/package/cors 设置跨域


    app.use('/static',express.static('static'));

    /**
     * Set session, using the redisStore
     */
    var session = require('express-session');
    var RedisStore = require('connect-redis')(session);

    /**
     * Init session in Redis
     */
    app.use(session({
        store: new RedisStore({
            host: __redisConfig.host,
            port: __redisConfig.port,
            ttl: __sessionTTL,
            db: 0                   // using the 1st(0) DB
        }),
        secret: __sessionSecret,
        saveUninitialized: false,
        resave: true
    }));

    var bodyParser = require('body-parser');
    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    initSubDomain(app);
    initControls(app);
    /**
     * 使用ejs需要设置的部分
     */
    app.set('views', path.join(__base, 'views'));
    app.set('view engine', 'ejs');


    //ccap验证码用到的部分
    //var ccap = require("ccap");
    //app.get("/captcha", function (req, res) {
    //    var captchaRobot = ccap(
    //        {
    //            width: 170,
    //            height: 60,
    //            offset: 40,
    //            quality: 40,
    //            generate: function() {
    //                var text = sprintf("%04d", Math.floor(Math.random()*10000));
    //                return text;
    //            }
    //        }
    //    );
    //    var captcha = captchaRobot.get();
    //    logger.ndump("session", req.session);
    //    req.session.captchaCode = captcha[0].toString();
    //    var captchaBuff = captcha[1];
    //    res.set('Content-Type', 'image/jpeg');
    //    res.set("Access-Control-Allow-Origin", "*");
    //    res.set("Access-Control-Allow-Headers", "X-Requested-With");
    //    res.set("Access-Control-Allow-Methods");
    //    // set browser cache ignore
    //    res.set('Cache-control', 'no-cache, must-revalidate');
    //    res.set('Pragma', 'no-cache');
    //    res.set('Expires', 'Sat, 26 Jul 1997 05:00:00 GMT');
    //    res.end(captchaBuff);
    //});

    return app;
};

/**
 *
 * 按照用户访问的域名/IP地址来加载对应的CustomerDB
 * @param app
 */
function initSubDomain(app) {

    /*
     * 按照用户访问的域名/IP地址来加载对应的CustomerDB
     */
    app.use(function (req, res, next) {
        logger.enter();
        // 分离域名或者ip地址
        var accessURL = req.protocol + "://" + req.host;
        var host = req.host.split(':');
        var domain = host[0].toLowerCase();
        var port = host[1];

        // 读取source ip地址
        req.ipv4 = req.ip.split(':').pop();

        logger.ndump("customer", req.session.customer);
        async.series([
            function checkDomain(done){
                /* 限制该用户在所授权的域上访问 */
                if ( ! underscore.isEmpty(req.session.customer) && (domain !== req.session.customer.domain)) {
                        /* 清除session */
                        logger.trace("destroy session");
                        req.session.destroy(function(){
                            done();
                        });
                } else {
                    done();
                }
            },
            function loadCustomerInfo(done){
                /**
                 * 从CloudDB.Customer中读取该domain对应的商户配置数据
                 */
                dbService.loadCustomerDBInfo(domain, function (err, results) {
                    if (!underscore.isEmpty(results)) {
                        if (results[0].enabled == false) {
                            logger.warn(results[0].customerName + "已经停止服务，请电话或邮件联络");
                            // todo render a service suspended page
                            return;
                        }

                        var customer = {
                            domain: domain,
                            customerId: results[0].customerId,
                            customerDB: __customerDBPrefix + "_" + results[0].customerDBSuffix,
                            customerEnabled: results[0].enabled == 1
                        };
                        req.session.customer = customer;

                        // 检查操作员是否被禁用
                        if (req.session && req.session.operator && req.session.operator.operatorId) {
                            dbService.getOperatorById(customer.customerDB, req.session.operator.operatorId, function(err2, operatorInfo){
                                if (operatorInfo && operatorInfo.operatorEnabled==false) {
                                    logger.debug("Operator " + req.session.operator.operatorName + " is banned to access!");
                                    req.session.destroy(function(){
                                        res.json(new FeedBack(FBCode.OPERATORDISABLED, "该操作员已经被禁用！"));
                                        next();
                                    });
                                } else {
                                    done(null);
                                }
                            });
                        } else {
                            done();
                        }
                    }else {
                        /**
                         * 该商户没有配置CloudDB数据
                         */
                        logger.info(domain + " doesn't have a CloudDB data. Redirecting to the cloud url");
                        res.redirect(__cloudURL);
                        done();
                    }
                });
            }
        ],
        function (err, resultList) {
            if(err){
                logger.error(err);
            }
            next();
        });
    });
}

function initErrorHandlers(app) {

    /**
     * Error handler for 404 not found
     */
    app.use( function(req, res,next) {
        var err = new Error('Not Found the requested URL: ' + req.url);
        err.status = 404;
        res.render('error/404', {
            message: err.message,
            error: err
        });
    });

    /**
     * Error handler for 500 Internal Server Error
     */
    app.use(function(err, req, res, next) {
        logger.error(err.toString() + ": " + err.stack);
        res.status(err.status || 500);
        res.render('error/500', {
            message: err.message,
            error: err
        });
    });
}


/*
 * traverse and load the apps
 */
var initControls = function(app) {
    logger.enter();

    var options = {
        followLinks:false,
        filters: [ __node_modules_path ]
    };

    var walker = require("walk").walk(__apps_path, options);

    walker.on('file', function(root, fileStats, next) {
        var filename = fileStats.name;
        if (filename === "controller.js") {
            logger.debug(root + filename);
            require(root+ "/" + filename)(app);
        }
        next();
    }).on('end', function(){
        initErrorHandlers(app);
    });

    return app;
};
