
#!/bin/bash -x
###############################################################################
# db-init.sh
#
# 新建初始化数据库脚本
#
# 修订历史：
# -----------------------------------------------------------------------------
# 2015-09-22    hc-romens@issue#29     统一数据库名称和域名
# 2015-09-20    hc-romens@issue#3      使用参数作为customerDB名称
# 2015-08-19    hc-romens@issue#3      新建文件


function print_setenv() {
    echo
    echo "必须先执行:"
    echo "----------------------------------------------"
    echo "    source bin/setenv.sh"
    echo "或者:"
    echo "    . bin/setenv.sh"
    echo

}

# 检查运行环境
[ "$GRAB_ROOT" = "" ] && print_setenv && exit 1

if [ "${GRAB_DB_PASSWORD}" = "" ]
then
    MYSQL="mysql -h ${GRAB_DB_HOST} -u ${GRAB_DB_USER}"
else
    MYSQL="mysql -h ${GRAB_DB_HOST} -u ${GRAB_DB_USER} -p${GRAB_DB_PASSWORD}"
fi

# 如果没有指定customerDB，则使用romens作为默认customer数据库
GRAB_CUSTOMERDB="${GRAB_CUSTOMERDB_PREFIX}_localhost"
if [ "$1" != "" ]
then
    SUFFIX=`echo $1 | sed 's/\./_/g'`
    GRAB_CUSTOMERDB="${GRAB_CUSTOMERDB_PREFIX}_${SUFFIX}"
fi

DB_ROOT=${GRAB_ROOT}/db/ddl
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

function loadEnterprise() {
    cloudDBName=$1
    echo "SELECT enterpriseType,customerDBSuffix FROM Customer;" | ${MYSQL} ${GRAB_CLOUDDB} 2>/dev/null | grep -e '^ORDER_SHIP' -e '^SELLER'
}

echo ${GRAB_CLOUDDB}
rebuildDB ${GRAB_CLOUDDB}
makeDB ${GRAB_CLOUDDB} ${DB_ROOT}/cloudDB

data=`loadEnterprise ${GRAB_CLOUDDB}`
echo ${data}

i=0
for x in ${data}
do
    if [ ${i} -eq 0 ]
    then
        i=1
        type=${x}
    else
        i=0
        name=${GRAB_CUSTOMERDB_PREFIX}_${x}
        rebuildDB ${name}
        makeDB ${name} ${DB_ROOT}/customerDB
        if [ "${type}" = "ORDER_SHIP" ]
        then
            makeDB ${name} ${DB_ROOT}/sellerOnly
        elif [ "${type}" = "BUYER" ]
        then
            makeDB ${name} ${DB_ROOT}/buyerOnly
        fi
    fi
done

