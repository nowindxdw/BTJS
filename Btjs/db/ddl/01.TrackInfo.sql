/*
 * Table: TrackInfo
 * 说明：追剧的信息
 */

DROP TABLE IF EXISTS TrackInfo;
CREATE TABLE TrackInfo(
	/* id */
	id 					BIGINT 		                AUTO_INCREMENT PRIMARY KEY,

	/*name for track obj */
	trackName           VARCHAR(300)                NOT NULL,

	/*url for track obj */
	trackUrl            VARCHAR(500)                NOT NULL,

	/* 启用标志 */
	enable				BOOL					    DEFAULT TRUE,

	/* 显示备注 */
	remark				VARCHAR(50)					DEFAULT "",

	/* 更新时间 */
    updatedOn           VARCHAR(64)                 DEFAULT NULL,
	/* 创建时间 */
	createdOn           TIMESTAMP                   DEFAULT CURRENT_TIMESTAMP
);


