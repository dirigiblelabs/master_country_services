/* globals $ */
/* eslint-env node, dirigible */

var entityMaster_country = require('master_country_services/country_lib');
var request = require("net/http/request");
var response = require("net/http/response");
var xss = require("utils/xss");

handleRequest();

function handleRequest() {
	
	response.setContentType("application/json; charset=UTF-8");
	response.setCharacterEncoding("UTF-8");
	
	// get method type
	var method = request.getMethod();
	method = method.toUpperCase();
	
	//get primary keys (one primary key is supported!)
	var idParameter = entityMaster_country.getPrimaryKey();
	
	// retrieve the id as parameter if exist 
	var id = xss.escapeSql(request.getParameter(idParameter));
	var count = xss.escapeSql(request.getParameter('count'));
	var metadata = xss.escapeSql(request.getParameter('metadata'));
	var sort = xss.escapeSql(request.getParameter('sort'));
	var limit = xss.escapeSql(request.getParameter('limit'));
	var offset = xss.escapeSql(request.getParameter('offset'));
	var desc = xss.escapeSql(request.getParameter('desc'));
	
	if (limit === null) {
		limit = 100;
	}
	if (offset === null) {
		offset = 0;
	}
	
	if(!entityMaster_country.hasConflictingParameters(id, count, metadata)) {
		// switch based on method type
		if ((method === 'POST')) {
			// create
			entityMaster_country.createMaster_country();
		} else if ((method === 'GET')) {
			// read
			if (id) {
				entityMaster_country.readMaster_countryEntity(id);
			} else if (count !== null) {
				entityMaster_country.countMaster_country();
			} else if (metadata !== null) {
				entityMaster_country.metadataMaster_country();
			} else {
				entityMaster_country.readMaster_countryList(limit, offset, sort, desc);
			}
		} else if ((method === 'PUT')) {
			// update
			entityMaster_country.updateMaster_country();    
		} else if ((method === 'DELETE')) {
			// delete
			if(entityMaster_country.isInputParameterValid(idParameter)){
				entityMaster_country.deleteMaster_country(id);
			}
		} else {
			entityMaster_country.printError(response.BAD_REQUEST, 4, "Invalid HTTP Method", method);
		}
	}
	
	// flush and close the response
	response.flush();
	response.close();
}