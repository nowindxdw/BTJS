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
 * data service
 *
 *      Provide the fundam4ental data service
 */
module.exports=function() {


    /**
     * system service handles
     */
    var logger  = __logService;

    /**
     * 3rd party modules
     */

    /**
     * Data Service provider
     */
    var dataService = {
        /**
         * commonData
         *      This methods aggreegates the needed data for all templates,
         *      like, logged-in operator name, info, etc.
         *      all kv pairs generated in commonData() starts the key name
         *      with an underscore char ("_").
         * @param req
         * @param done  The callback function(data),
         *              data的格式为：
         *              {
         *                  _version:  ,
         *                  _translation:,
         *                 ....
         *              }
         */
        commonData: function(req, done) {
            logger.enter();
            var data = {};
            staticData(req, data, function(data1){
               done(data1)
            });
        }


    };

    /**
     * 加载数据库中状态字段对应的翻译表
     * @see db/ddl/customerDB/OrderInfo.sql
     * @param req
     * @param data
     * @param done
     */
    function staticData(req, data, done) {
        logger.enter();
        data._version = __version;
        data._translation = {
            "OrderStatus" : {                   // OrderInfo.status
                "CREATED": "已提交待审核",
                "APPROVED": "已受理待发货",
                "SHIPPED": "商家已发货",
                'FINISHED':"已完成订单",
                "CLOSED": "已关闭订单"
            },
            "ReturnStatus" : {                 // ReturnInfo.status
                "CREATED": "退货待审核",
                "APPROVED": "退货审核通过",
                //"REJECTED": "审核未通过",
                "SHIPPED": "退货已发货",
                "DELIVERED": "退货已送达",
                "CLOSED": "退货已关闭"
            },
            "OrderAction": {                    // OrderHistory.action
                'CREATE': "创建订单",
                'APPROVE': "审核通过订单",
                'REJECT': "审核拒绝订单",
                'SHIP': "发货",
                'RECEIVE':	"收货",
                'REQUEST-RETURN': "申请退货",
                'APPROVE-RETURN': "批准退货申请",
                'REJECT-RETURN': "拒绝退货申请",
                'SHIP-RETURN': "退货发货",
                'RECEIVE-RETURN': "退货收货",
                'CLOSE': "关闭订单"
            },
            "PricePlan" : {                     // ClientGoodsPrice.pricePlan
                "WHOLESALE": "批发价",
                "PRICE1": "价格一",
                "PRICE2": "价格二",
                "PRICE3": "价格三",
                "CATEGORYPRICE": "客户类价格",
                "CLIENTPRICE": "客户价格"
            }
        };

        done(data);
    }

    return dataService;
};