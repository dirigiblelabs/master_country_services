/* globals $ */
/* eslint-env node, dirigible */

var request = require("net/http/request");
var response = require("net/http/response");
var database = require("db/database");

var datasource = database.getDatasource();

// create entity by parsing JSON object from request body
exports.createMaster_country = function() {
    var input = request.readInputText();
    var requestBody = JSON.parse(input);
    var connection = datasource.getConnection();
    try {
        var sql = "INSERT INTO MASTER_COUNTRY (";
        sql += "COUNTRY_NAME";
        sql += ",";
        sql += "COUNTRY_A2";
        sql += ",";
        sql += "COUNTRY_A3";
        sql += ",";
        sql += "COUNTRY_NUMERIC";
        sql += ") VALUES ("; 
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ")";

        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('MASTER_COUNTRY_COUNTRY_NAME').next();
        statement.setInt(++i, id);
        statement.setString(++i, requestBody.country_a2);
        statement.setString(++i, requestBody.country_a3);
        statement.setInt(++i, requestBody.country_numeric);
        statement.executeUpdate();
		response.println(id);
        return id;
    } catch(e) {
        var errorCode = response.BAD_REQUEST;
        exports.printError(errorCode, errorCode, e.message, sql);
    } finally {
        connection.close();
    }
    return -1;
};

// read single entity by id and print as JSON object to response
exports.readMaster_countryEntity = function(id) {
    var connection = datasource.getConnection();
    try {
        var result;
        var sql = "SELECT * FROM MASTER_COUNTRY WHERE " + exports.pkToSQL();
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, id);
        
        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            result = createEntity(resultSet);
        } else {
        	exports.printError(response.NOT_FOUND, 1, "Record with id: " + id + " does not exist.", sql);
        }
        var jsonResponse = JSON.stringify(result, null, 2);
        response.println(jsonResponse);
    } catch(e){
        var errorCode = response.BAD_REQUEST;
        exports.printError(errorCode, errorCode, e.message, sql);
    } finally {
        connection.close();
    }
};

// read all entities and print them as JSON array to response
exports.readMaster_countryList = function(limit, offset, sort, desc) {
    var connection = datasource.getConnection();
    try {
        var result = [];
        var sql = "SELECT ";
        if (limit !== null && offset !== null) {
            sql += " " + datasource.getPaging().genTopAndStart(limit, offset);
        }
        sql += " * FROM MASTER_COUNTRY";
        if (sort !== null) {
            sql += " ORDER BY " + sort;
        }
        if (sort !== null && desc !== null) {
            sql += " DESC ";
        }
        if (limit !== null && offset !== null) {
            sql += " " + datasource.getPaging().genLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
        var jsonResponse = JSON.stringify(result, null, 2);
        response.println(jsonResponse);
    } catch(e){
        var errorCode = response.BAD_REQUEST;
        exports.printError(errorCode, errorCode, e.message, sql);
    } finally {
        connection.close();
    }
};

//create entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
    result.country_name = resultSet.getString("COUNTRY_NAME");
    result.country_a2 = resultSet.getString("COUNTRY_A2");
    result.country_a3 = resultSet.getString("COUNTRY_A3");
	result.country_numeric = resultSet.getInt("COUNTRY_NUMERIC");
    return result;
}

function convertToDateString(date) {
    var fullYear = date.getFullYear();
    var month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
    var dateOfMonth = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return fullYear + "/" + month + "/" + dateOfMonth;
}

// update entity by id
exports.updateMaster_country = function() {
    var input = request.readInputText();
    var responseBody = JSON.parse(input);
    var connection = datasource.getConnection();
    try {
        var sql = "UPDATE MASTER_COUNTRY SET ";
        sql += "COUNTRY_A2 = ?";
        sql += ",";
        sql += "COUNTRY_A3 = ?";
        sql += ",";
        sql += "COUNTRY_NUMERIC = ?";
        sql += " WHERE COUNTRY_NAME = ?";
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, responseBody.country_a2);
        statement.setString(++i, responseBody.country_a3);
        statement.setInt(++i, responseBody.country_numeric);
        var id = responseBody.country_name;
        statement.setInt(++i, id);
        statement.executeUpdate();
		response.println(id);
    } catch(e){
        var errorCode = response.BAD_REQUEST;
        exports.printError(errorCode, errorCode, e.message, sql);
    } finally {
        connection.close();
    }
};

// delete entity
exports.deleteMaster_country = function(id) {
    var connection = datasource.getConnection();
    try {
    	var sql = "DELETE FROM MASTER_COUNTRY WHERE " + exports.pkToSQL();
        var statement = connection.prepareStatement(sql);
        statement.setString(1, id);
        statement.executeUpdate();
        response.println(id);
    } catch(e){
        var errorCode = response.BAD_REQUEST;
        exports.printError(errorCode, errorCode, e.message, sql);
    } finally {
        connection.close();
    }
};

exports.countMaster_country = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM MASTER_COUNTRY';
        var statement = connection.prepareStatement(sql);
        var rs = statement.executeQuery();
        if (rs.next()) {
            count = rs.getInt(1);
        }
    } catch(e){
        var errorCode = response.BAD_REQUEST;
        exports.printError(errorCode, errorCode, e.message, sql);
    } finally {
        connection.close();
    }
    response.println(count);
};

exports.metadataMaster_country = function() {
	var entityMetadata = {
		name: 'master_country',
		type: 'object',
		properties: []
	};
	
	var propertycountry_name = {
		name: 'country_name',
    	type: 'string',
	key: 'true',
	required: 'true'
	};
    entityMetadata.properties.push(propertycountry_name);

	var propertycountry_a2 = {
		name: 'country_a2',
		type: 'string'
	};
    entityMetadata.properties.push(propertycountry_a2);

	var propertycountry_a3 = {
		name: 'country_a3',
		type: 'string'
	};
    entityMetadata.properties.push(propertycountry_a3);

	var propertycountry_numeric = {
		name: 'country_numeric',
		type: 'integer'
	};
    entityMetadata.properties.push(propertycountry_numeric);


	response.println(JSON.stringify(entityMetadata));
};

exports.getPrimaryKeys = function() {
    var result = [];
    var i = 0;
    result[i++] = 'COUNTRY_NAME';
    if (result === 0) {
        throw new Error("There is no primary key");
    } else if(result.length > 1) {
        throw new Error("More than one Primary Key is not supported.");
    }
    return result;
};

exports.getPrimaryKey = function() {
	return exports.getPrimaryKeys()[0].toLowerCase();
};

exports.pkToSQL = function() {
    var pks = exports.getPrimaryKeys();
    return pks[0] + " = ?";
};

exports.hasConflictingParameters = function(id, count, metadata) {
    if(id !== null && count !== null){
    	printError(response.EXPECTATION_FAILED, 1, "Expectation failed: conflicting parameters - id, count");
        return true;
    }
    if(id !== null && metadata !== null){
    	printError(response.EXPECTATION_FAILED, 2, "Expectation failed: conflicting parameters - id, metadata");
        return true;
    }
    return false;
}

// check whether the parameter exists 
exports.isInputParameterValid = function(paramName) {
    var param = request.getParameter(paramName);
    if(param === null || param === undefined){
    	printError(response.PRECONDITION_FAILED, 3, "Expected parameter is missing: " + paramName);
        return false;
    }
    return true;
}

// print error
exports.printError = function(httpCode, errCode, errMessage, errContext) {
    var body = {'err': {'code': errCode, 'message': errMessage}};
    response.setStatus(httpCode);
    response.setHeader("Content-Type", "application/json");
    response.print(JSON.stringify(body));
    console.error(JSON.stringify(body));
    if (errContext !== null) {
    	console.error(JSON.stringify(errContext));
    }
}
