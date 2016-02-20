#!/bin/bash
###############################################################################
# setenv.sh
#
# 设置GRAB项目的开发环境变量, 执行方法：
#     $> cd ssc-src/bin
#     $> . ./setenv.sh


function print_help() {
    echo
    echo "必须在项目根路径下, 以source方式执行："
    echo "==========================================================="
    echo "    source bin/setenv.sh [DB Server]"
    echo "或者"
    echo "    . bin/setenv.sh"
    echo

    return 0
}

# 检查是否以source方式运行
[ "`basename $0 2>/dev/null`" = "setenv.sh" ] && print_help && exit 1

# 检查是否在项目根目录下
ls bin/setenv.sh >/dev/null 2>&1
[ $? -ne 0 ] && print_help && return 1

# 设置基本的环境变量
GRAB_ROOT=`pwd`
PATH=${GRAB_ROOT}/bin:${PATH}
USER=$(whoami)
GRAB_LOG_ROOT=${GRAB_ROOT}/log
GRAB_UPLOAD_ROOT=${GRAB_ROOT}/uploads
DB_SUFFIX="_${USER}"

# 检查log路径, 并设置为可写
#[ -d ${GRAB_LOG_ROOT} ] || mkdir ${GRAB_LOG_ROOT}
#chmod a+w ${GRAB_LOG_ROOT}
#[ -d ${GRAB_UPLOAD_ROOT} ] || mkdir ${GRAB_UPLOAD_ROOT}
#chmod a+w ${GRAB_UPLOAD_ROOT}

GRAB_DB_USER="root"
if [ "$1" = "" ]
then
  GRAB_DB_HOST=localhost
  GRAB_REDIS_HOST=localhost
  alias mysql="mysql -h ${GRAB_DB_HOST} -u ${GRAB_DB_USER}"
else
  GRAB_DB_HOST=$1
  GRAB_DB_PASSWORD='romens@2015'
  GRAB_REDIS_HOST=$1
  alias mysql="mysql -h ${GRAB_DB_HOST} -u ${GRAB_DB_USER} -p${GRAB_DB_PASSWORD}"
fi

GRAB_CLOUDDB=`cat config/sysconfig.json  | grep CloudDB | tail -1 | sed -e 's/^.*: *"//g' -e 's/".*$//g'`"${DB_SUFFIX}"
CUSTOMERDB=`cat config/sysconfig.json  | grep customerDBPrefix | tail -1 | sed -e 's/^.*: *"//g' -e 's/".*$//g'`
GRAB_CUSTOMERDB_PREFIX=`cat config/sysconfig.json  | grep customerDBPrefix | tail -1 | sed -e 's/^.*: *"//g' -e 's/".*$//g'`"${DB_SUFFIX}"

# export env variables
export GRAB_ROOT GRAB_UPLOAD_PATH GRAB_LOG_PATH GRAB_DB_HOST GRAB_REDIS_HOST GRAB_CLOUDDB GRAB_CUSTOMERDB_PREFIX GRAB_DB_USER GRAB_DB_PASSWORD PATH

