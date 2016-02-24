/*
 * Table: TrackDetails
 * 说明：追剧的详细信息
 */

DROP TABLE IF EXISTS TrackDetails;
CREATE TABLE TrackDetails(
	/* id */
	id 					BIGINT 		                AUTO_INCREMENT PRIMARY KEY,

	/*id for track obj */
	trackId             BIGINT                      DEFAULT NULL,

	/*result for track obj */
	trackResult         VARCHAR(500)                DEFAULT NULL,

    /*url for track result */
    resultUrl           VARCHAR(500)                DEFAULT NULL,

	/* order by */
	listOrder		    BIGINT					    DEFAULT NULL,

	/* 标记 */
	remark              VARCHAR(50)                 DEFAULT "UNREAD",

	/* 更新时间 */
	updatedOn           VARCHAR(64)                 DEFAULT NULL,

	/* 创建时间 */
	createdOn           TIMESTAMP                   DEFAULT CURRENT_TIMESTAMP,

	UNIQUE KEY (trackId, listOrder)

);


