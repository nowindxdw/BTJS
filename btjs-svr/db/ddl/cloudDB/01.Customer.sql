/*****************************************************************
 * 青岛雨人软件有限公司©2015版权所有
 *
 * 本软件之所有（包括但不限于）源代码、设计图、效果图、动画、日志、
 * 脚本、数据库、文档均为青岛雨人软件或其附属子公司所有。任何组织
 * 或者个人，未经青岛雨人软件书面授权，不得复制、使用、修改、分发、
 * 公布本软件的任何部分。青岛雨人软件有限公司保留对任何违反本声明
 * 的组织和个人采取法律手段维护合法权益的权利。
 *****************************************************************/

/**********************************************************************
 * Table: Customer
 * 说明：企业数据库名信息,grab-svr项目（要配送）指连锁药店企业名
 *
 * 修订历史：
 * --------------------------------------------------------------------
 * 2015-09-20   hc-romens@issue#23      修改DATABASELIST为CUSTOMER
 *
 * 
 * */
/**********************************************************************/

DROP TABLE IF EXISTS Customer;
CREATE TABLE Customer (

    /* auto increment primary key */
	id                      BIGINT AUTO_INCREMENT PRIMARY KEY,

	/* 对应医药365企业id, RESERVED */
	orgId                   BIGINT DEFAULT NULL,

    /* 企业名称 */
    customerName            VARCHAR(80) NOT NULL,

    /*
     * 企业类型:订单+派送。
     * 
     */
    enterpriseType          ENUM(
                                "ORDER_SHIP"
                            ) NOT NULL DEFAULT "ORDER_SHIP",

	/* 商户对应数据库后缀名称 */
	customerDBSuffix        VARCHAR(45) NOT NULL,

   

    /* 商户托管门户入口域名 */
    subDomain               VARCHAR(16) DEFAULT NULL,

    /* 商户站点名称 */
    siteName                VARCHAR(256) DEFAULT NULL,

    /* 商户启用/禁用标志 */
    enabled                 BOOL DEFAULT TRUE,

    /* 商户描述 */
	description             VARCHAR(256) DEFAULT NULL,


	/* 营业执照号 */
	businessLicense 		VARCHAR(50) DEFAULT NULL,

    /* 执照期限 */
    businessLicenseValidateDate DATE DEFAULT NULL,

	/* 营业地址 */
	businessAddress 		VARCHAR(200) DEFAULT NULL,

	/* 法人代表 */
  	legalRepresentative 	VARCHAR(50) DEFAULT NULL,



    /* 创建时间 */
	createdOn    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,

	/* 最近更新时间 */
	updatedOn    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
