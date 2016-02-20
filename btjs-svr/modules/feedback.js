/*****************************************************************
 * 青岛雨人软件有限公司©2015版权所有
 *
 * 本软件之所有（包括但不限于）源代码、设计图、效果图、动画、日志、
 * 脚本、数据库、文档均为青岛雨人软件或其附属子公司所有。任何组织
 * 或者个人，未经青岛雨人软件书面授权，不得复制、使用、修改、分发、
 * 公布本软件的任何部分。青岛雨人软件有限公司保留对任何违反本声明
 * 的组织和个人采取法律手段维护合法权益的权利。
 *****************************************************************/

/**
 * feedback.js
 *
 * --------------------------------------------------------------
 * 2015-10-28   hc-romens@issue#357 optimiazed
 */
var logger = __logService;

var FB_CODE = {
    OK     : 200,           // [GET]：服务器成功返回用户请求的数据
    /* GRAB-SVR FB code */
    CREATED : 201 ,         // [POST/PUT/PATCH]：用户新建或修改数据成功。
    Accepted :202 ,         //[*]：表示一个请求已经进入后台排队（异步任务）
    NO_CONTENT:  204,       // [DELETE]：用户删除数据成功。
    INVALID_REQUEST:400,    //- [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
    Unauthorized:401,       // - [*]：表示用户没有权限（令牌、用户名、密码错误）。
    Forbidden: 403,         // [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
    NOT_FOUND :404,         // [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
    Not_Acceptable:406,     // [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
    Gone: 410,              //[GET]：用户请求的资源被永久删除，且不会再得到的。
    Unprocesable_entity:422,//  [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
    INTERNAL_SERVER_ERROR:500,// [*]：服务器发生错误，用户将无法判断发出的请求是否成功。
    /* SCC Error code */
    DUPDATA         : 1001,       // 数据已经存在于数据库中
    INVALIDCAPTCHA  : 1002,       // 验证码错误
    LOGINFAILURE    : 1003,       // 账号密码不符
    CLIENTDISABLED  : 1004,       // 客户已经被禁用
    INVALIDAPPKEY   : 1005,       // 无效的APPKEY
    INVALIDAPPCODE  : 1006,       // 无效的APPCODE
    OPERATORDISABLED: 1007,       // 操作员已经被禁用
    CUSTOMERDISABLED: 1008,       // 商户账号已经被禁用
    USERDISABLED    : 1009,       // 账号已经被禁用
    MAXPASSWDFAIL   : 1010,       // 达到密码最大连续错误次数，账号锁定若干时间
    NOTFOUND        : 1011,       // 没有匹配到对象
    REDISERR        : 1012,       // Redis读写错误
    CACHEDISABLED   : 1013,       // 缓存被关闭
    INTERNALERROR   : 5001,       // 服务器内部错误
    INVALIDACTION   : 6001,       // 无效的操作
    AUTHFAILURE     : 7001,       // 没有执行该操作的授权
    INVALIDDATA     : 8001,       // 无效的数据
    DBFAILURE       : 9001        // 数据库操作失败
};

function FeedBack(retcode, message, data) {
    this.status = retcode;
    this.msg = message;
    this.data = data;
    logger.dump("feedback: status=" + this.status + ", msg=" + this.msg + ", data=" + JSON.stringify(this.data));
}

module.exports.FBCode = FB_CODE;
module.exports.FeedBack = FeedBack;