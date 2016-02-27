
//parse data
var logger = global.__logService;
var underscore = require("underscore");
    /**
     *
     *
     * var dataStr=parseUpdateInfo(updateData);
     * var SQL="UPDATE TableName SET %s WHERE condition;";
     * var sql = sprintf(SQL,DBName,dataStr);
     *
     * @param data
     * @returns {string}
     */
    function parseUpdateInfo(data){
    var result = "";
    if(underscore.isEmpty(data)) {
        return result;
    }

    for(var key in data){
        result += key + "='"+data[key] +"'," ;
    }
    result = result.slice(0,-1);
    return result;
    }

    /**
     *
     *
     * var data=parseInsertInfo(insertData);
     * var keys = data.keys;
     * var values = data.values;
     * var SQL="INSERT INTO %s.TableName (%s) VALUES (%s);";
     * var sql = sprintf(SQL,DBName,keys,values);
     *
     * @param data
     * @returns {{keys: string, values: string}}
     */
    function parseInsertInfo(data){
        var result = {keys:"",values:""};
        for(var key in data){
            if(data[key]) {
                result.keys += key + "," ;
                result.values += data[key]+ ",";
            }
        }
        result.keys = result.keys.slice(0,-1);
        result.values = result.values.slice(0,-1);
        return result;
    }


    /**
     *
     *
     * var data = parseInsertOnDuplicateInfo(IOD_Info);
     * var SQL = "INSERT INTO %s.TableName (%s) VALUES ? ON DUPLICATE KEY UPDATE %s;";
     * var sql = sprintf(SQL,DBName,data.keyStr,data.valueStr,data.updateStr);
     * @param data
     * @returns {{keyStr: string, valueStr: string, updateStr: string}}
     */
    function parseInsertOnDuplicateInfo (data){
        var result = {
            keyStr:"",
            valueStr:"",
            updateStr:""};
        for(var key in data){
            if(!underscore.isUndefined(data[key])) {
                result.keyStr += key + "," ;
                result.valueStr += "'"+data[key]+ "',";
                result.updateStr += key +"=Values("+key+"),";
            }
        }
        result.keyStr = result.keyStr.slice(0,-1);
        result.valueStr = result.valueStr.slice(0,-1);
        result.updateStr = result.updateStr.slice(0,-1);
        return result;
    }
//Exports
exports.parseUpdateInfo = parseUpdateInfo;
exports.parseInsertInfo = parseInsertInfo;
exports.parseInsertOnDuplicateInfo= parseInsertOnDuplicateInfo;



