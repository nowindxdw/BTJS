#!/bin/bash -x
###############################################################################
# db-init.sh
#
# 新建初始化数据库脚本
# 执行脚本：根目录下 sh bin/db-init.sh
# 设置基本的环境变量
BTJS_ROOT=`pwd`
PATH=${BTJS_ROOT}/bin:${PATH}
USER=$(whoami)
BTJS_LOG_ROOT=${BTJS_ROOT}/log
BTJS_UPLOAD_ROOT=${BTJS_ROOT}/uploads
DB_SUFFIX="_${USER}"
BTJS_DB_HOST=localhost
BTJS_DB_PASSWORD="100821"
BTJS_DB_USER="root"
# 检查运行环境
[ "$BTJS_ROOT" = "" ] &&  exit 1

if [ "${BTJS_DB_PASSWORD}" = "" ]
then
    MYSQL="mysql -h ${BTJS_DB_HOST} -u ${BTJS_DB_USER}"
else
    MYSQL="mysql -h ${BTJS_DB_HOST} -u ${BTJS_DB_USER} -p${BTJS_DB_PASSWORD}"
fi

# 使用dawei作为默认customer数据库
BTJS_DB="dawei_localhost"

DB_ROOT=${BTJS_ROOT}/db/ddl
RESULT=/tmp/$$.err
function rebuildDB() {
    dbName=$1
    ${MYSQL} 2>/dev/null << EOF!
        DROP DATABASE IF EXISTS ${dbName};
        CREATE DATABASE IF NOT EXISTS ${dbName} DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
EOF!
}
function makeDB() {
    dbName=$1
    sqlRoot=$2

    SQL=`find ${sqlRoot} -name "*sql" | sort`
    echo "Initializing Database: ${dbName} ..."
    for sql in ${SQL}
    do
        echo "Executing `basename ${sql}` ..."
        cat ${sql} | ${MYSQL} ${dbName} > ${RESULT} 2>&1
        [ $? -ne 0 ] && echo "FAILED!" && cat ${RESULT} | grep -v "^Warning: Using a password.*$" && exit 1
    done

    echo "Database <${dbName}> is sucessfully created!"
    echo "---------------------------------------------------------"
    echo
    return 0
}

rebuildDB ${BTJS_DB}
makeDB ${BTJS_DB} ${DB_ROOT}


