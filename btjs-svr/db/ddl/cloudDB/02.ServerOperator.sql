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
 * Table: ServerOperator
 * 说明：平台操作员的信息
 */

DROP TABLE IF EXISTS ServerOperator;
CREATE TABLE ServerOperator(
	/* id */
	id 					BIGINT 		                AUTO_INCREMENT PRIMARY KEY,

	/* username, login name */
	username            VARCHAR(32)                 UNIQUE NOT NULL,

	/* password */
	password            VARCHAR(300)                NOT NULL,

	/* 操作员姓名 */
	operatorName        VARCHAR(50)                 DEFAULT  "server_operator",

	/* 操作员手机号码 */
	mobileNum           VARCHAR(50)                 DEFAULT NULL,


	/* 头像图片url地址 avatarUrl */
	imageUrl     	    VARCHAR(500)         	    DEFAULT NULL,


	/* 操作员编号 */
	operatorCode        VARCHAR(50)                 DEFAULT NULL,


	/* 启用标志 */
	enable				BOOL					    DEFAULT TRUE,

	/* 操作员身份证号码 */
	citizenIdNum        VARCHAR(50)                 DEFAULT  NULL,

	/* 操作员email */
	email               VARCHAR(100)                DEFAULT NULL,

	/* 登录失败计数器 */
	failCount           INT                         DEFAULT 0,

	/* 更新时间 */
	updatedOn           TIMESTAMP                   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	/* 创建时间 */
	createdOn           TIMESTAMP                   DEFAULT CURRENT_TIMESTAMP
);


