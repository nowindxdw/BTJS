/*****************************************************************
 * 青岛雨人软件有限公司?2015版权所有
 *
 * 本软件之所有（包括但不限于）源代码、设计图、效果图、动画、日志、
 * 脚本、数据库、文档均为青岛雨人软件或其附属子公司所有。任何组织
 * 或者个人，未经青岛雨人软件书面授权，不得复制、使用、修改、分发、
 * 公布本软件的任何部分。青岛雨人软件有限公司保留对任何违反本声明
 * 的组织和个人采取法律手段维护合法权益的权利。
 *****************************************************************/

/*
 * app.js
 *    grab-svr start up entry
 *
 *
 */

var underscore = require("underscore");
var logger = require(__dirname+"/services/logService");

/* init logger service */
global.__logService = logger;


/*
 * The main entry
 */
var main = function() {

  /**
   * 初始化全局变量
   */
  initGlobalVariables();

  logger.setLevel(__logLevel);

  readCliOptions();

  /* init Redis connections */
  require(__base+"/init/initRedis").initRedis();

  if (!__modeWorker) {

    /* init DB  connections */
    require(__base+"/init/initDB").initDB();

    /* init other modules/apps/services */
    var app = require(__dirname+"/init/init").initApp();

    logger.info("Run in mode: Server");

    startServer(app);
  }
  else {
    //启动离线任务worker模式
    require(__base + "/init/initDB").initDB(__mqConfig.dbConnectionLimit);
    logger.info("Run in mode: Worker");
    startWorker();
  }
};

/**
 * Initialize the global variables
 *
 * The config params' priority is:
 *      CLI > Envars > sysconfig.json
 */
var initGlobalVariables=function (){

  /**
   * Basic config
   */
  global.__base   = __dirname;
  global.__port   = 3000;

  /**
   * Path config
   */
  global.__apps_path = __base + "/apps";
  global.__node_modules_path = __base + "/node_modules";
  global.__modules_path = __base + "/modules";
  global.__services_path = __base + "/services";
  global.__db_service_path = __services_path + "/database";
  global.__db_schema_path = __base + "/db";

  /**
   * system config
   */
  var sysconf = replaceSysConfWithEnvars(require(__dirname + '/config/sysconfig.json'));

  global.__logLevel = sysconf.logLevel;
  global.__isErpMsgCheckStrict = sysconf.isErpMsgCheckStrict;
  global.__erpApiVersion = sysconf.__erpApiVersion;

  global.__enableCaptcha = sysconf.enableCaptcha;

  /* say, romens.cn */
  global.__cloudURL = sysconf.cloudURL;

  /* CustomerDB_hc as the customer db name prefix, "hc" is the user name */
  global.__customerDBPrefix = sysconf.customerDBPrefix;

  /* cloud db name */
  global.__cloudDBName = sysconf.cloudDBName;

  /* seesion secret */
  global.__sessionSecret = sysconf.sessionSecret;

  /* session TTL */
  global.__sessionTTL = sysconf.sessionTTL;

  /* session goodsTop buy days 统计商品排行天数 */
  global.__goodsTopDays = sysconf.goodsTopBuyDays;

  /* db config */
  global.__dbConfig = sysconf.db;

  /* redis config */
  global.__redisConfig = sysconf.redis;

  /* cache config */
  global.__cacheConfig = sysconf.cache;

  /* index newsCounts*/
  global.__newsMaxCounts=sysconf.indexNewsCounts;

  /* sms config*/
  global.__smsConfig=sysconf.sms;

  /* security config */
  global.__securityConfig = sysconf.security;

  /**
   * MQ config
   */
  global.__mqConfig = sysconf.mq;
  global.__queues = { OfflineTask: __mqConfig.OfflineTaskPrefix + "_" + process.env.USER };

  /**
   * load services
   */
  global.__cacheService = require(__services_path + "/cacheService")();
  global.__dbService  = require(__services_path + "/dbService")();
  global.__dataService = require(__services_path + "/dataService")();
  global.__mqService = require(__services_path + "/mqService")();


  /**
   * worker path
   */
  global.__worker_path = __base + "/worker";


};

/**
 * replaceSysConfWithEnvars
 *      Replace the system configuration params with Envrionment Variabls,
 *      if exists. This is a solution to overwrite the config params by
 *      a shell script, @see /bin/setenv.sh
 * @param sysconf
 */
function replaceSysConfWithEnvars(sysconf) {
  var logger = __logService;

  /* Delete the comments, cause it is for comments purpose */
  delete sysconf.__comments;

  /* DB Host */
  if (!underscore.isUndefined(process.env.GRAB_DB_HOST)) sysconf.db.host = process.env.GRAB_DB_HOST;
  /* DB User */
  if (!underscore.isUndefined(process.env.GRAB_DB_USER)) sysconf.db.user = process.env.GRAB_DB_USER;
  /* DB password */
  if (!underscore.isUndefined(process.env.GRAB_DB_PASSWORD)) sysconf.db.password = process.env.GRAB_DB_PASSWORD;

  /* CloudDBName */
  if (!underscore.isUndefined(process.env.GRAB_CLOUDDB)) sysconf.cloudDBName = process.env.GRAB_CLOUDDB;
  /* CustomerDBPrefix */
  if (!underscore.isUndefined(process.env.GRAB_CUSTOMERDB_PREFIX))
    sysconf.customerDBPrefix = process.env.GRAB_CUSTOMERDB_PREFIX;

  /* Redis host */
  if (!underscore.isUndefined(process.env.GRAB_REDIS_HOST)) sysconf.redis.host = process.env.GRAB_REDIS_HOST;

  logger.ndump("Applying sysconf", sysconf);

  return sysconf;
}

/*
 * read command line options, overwrite the global variables if needed
 */
var readCliOptions = function() {

  // read CLI options
  var stdio = require("stdio");
  var options = stdio.getopt({
    'port': {key: 'p', description: 'port number', default: '4500', args: 1},
    'worker': {key: 'w', description: '启动worker模式', default: false, args:0 }
  });

  logger.ndump("options", options);
  // update global options
  global.__port = options.port;
  global.__modeWorker = options.worker;
};

var startServer = function(app){
  logger.enter();

  var http = require('http');

  var port = __port;
  app.set('port', port);

  /**
   * Create HTTP server.
   */

  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  /**
   * Normalize a port into a number, string, or false.
   */



  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;

    logger.info('Listening on ' + bind);
  }

};

/**
 * Start the application as offline task works
 */
var startWorker = function(){
  logger.enter();
  var worker = require(__worker_path + "/worker")();

  worker.go();
};

main();



