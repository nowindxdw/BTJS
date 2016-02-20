/*****************************************************************
 * 青岛雨人软件有限公司©2015版权所有
 *
 * 本软件之所有（包括但不限于）源代码、设计图、效果图、动画、日志、
 * 脚本、数据库、文档均为青岛雨人软件或其附属子公司所有。任何组织
 * 或者个人，未经青岛雨人软件书面授权，不得复制、使用、修改、分发、
 * 公布本软件的任何部分。青岛雨人软件有限公司保留对任何违反本声明
 * 的组织和个人采取法律手段维护合法权益的权利。
 *****************************************************************/

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

    var feedback = require(__modules_path + "/feedback");
    var FBCode = feedback.FBCode;
    var FeedBack = feedback.FeedBack;

    /**
     * CACHE Service provider
     */
    var cacheService = {

        /**
         * 所有的预设缓存keys
         */
        CacheKeys : {
            GoodsTypesInJSON: "goodsTypesInJSON",
            ERP: "ERP"
        },

        /**
         * 默认的缓存时间
         */
        TTL :  underscore.clone(__cacheConfig.TTL),

        /**
         * 删除一个cache缓存
         * @param key
         * @param callback
         */
        deleteCache: function(key, callback) {
            logger.enter();
            if (__cacheConfig.enable == false) {
                callback(FBCode.CACHEDISABLED);
                return;
            }
            __redisClient.del(key, function(err){
                logger.enter();
                if (err) {
                    logger.error(err);
                    callback(FBCode.REDISERR);
                } else {
                    callback(FBCode.SUCCESS);
                }
            });
        },

        /**
         * 读取key指定的缓存数据
         * @param key
         * @param callback
         */
        get: function(key, callback) {
            logger.enter();
            if (__cacheConfig.enable == false) {
                callback(FBCode.CACHEDISABLED);
                return;
            }
            __redisClient.get(key, function(err, data){
                if (underscore.isEmpty(data)) {
                    logger.info("Cache Key: " + key + " is not found in REDIS");
                    callback(FBCode.NOTFOUND)
                } else {
                    logger.trace("Cache key: " + key + " hit!");
                    callback(FBCode.SUCCESS, data);
                }
            });
        },

        /**
         * 保存数据到key，并指定超时时间（秒)
         * @param key
         * @param data
         * @param ttl
         */
        set: function(key, data, ttl) {
            if (__cacheConfig.enable == false) {
                callback(FBCode.CACHEDISABLED);
                return;
            }
            logger.enter();
            __redisClient.set(key, JSON.stringify(data));
            if (!underscore.isUndefined(ttl))
                __redisClient.expire(key, ttl);
        }

    };

    return cacheService;
}