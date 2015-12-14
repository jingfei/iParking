var geocoder = require("geocoder");
var request = require("request");
var fs = require("fs");

module.exports={
	
	initialize: function(api, next){
		api.map={
			transTainanFrom: function(website, next){
				if(website==null) website="http://data.tainan.gov.tw/api/action/datastore_search?resource_id=597f3e87-d326-4404-9a64-efc30eeac5e3";
				var data = { "web": "init" };
				// Set the headers
				var headers = {
					'User-Agent':       'Super Agent/0.0.1',
					'Content-Type':     'application/x-www-form-urlencoded'
				}
				 
				 // Configure the request
				var options = {
					url: website,
					method: 'GET',
					headers: headers,
				}
				
				// Start the request
				request(options, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						var result = JSON.parse(body).result.records;
						result.forEach(function(res, i){
							var tainan = "台南市"+res.行政區;
							var from=tainan + res.路段名稱.split("-")[0];
							var to1 =tainan + res.路段說明.split("-")[0];
							var to2 =tainan + res.路段說明.split("-")[1];
							geocoder.geocode(from+'and'+to1, function(error, geo){
								var line1 = geo.results[0].geometry.location;
								data.line1 = line1;
								next(error, data);
							}, {language: 'zh-tw'});
						});
					} 
				});
			},
			transTainanTo: function(website, next){
				if(website==null) website="http://data.tainan.gov.tw/api/action/datastore_search?resource_id=597f3e87-d326-4404-9a64-efc30eeac5e3";
				var data = { "web": "init" };
				// Set the headers
				var headers = {
					'User-Agent':       'Super Agent/0.0.1',
					'Content-Type':     'application/x-www-form-urlencoded'
				}
				 
				 // Configure the request
				var options = {
					url: website,
					method: 'GET',
					headers: headers,
				}
				
				// Start the request
				request(options, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						var result = JSON.parse(body).result.records;
						result.forEach(function(res, i){
							var tainan = "台南市"+res.行政區;
							var from=tainan + res.路段名稱.split("-")[0];
							var to1 =tainan + res.路段說明.split("-")[0];
							var to2 =tainan + res.路段說明.split("-")[1];
							geocoder.geocode(from+'and'+to2, function(error, geo){
								var line2 = geo.results[0].geometry.location;
								data.line2 = line2;
								data.count = i;
								if(i==10) next(error, data);
							}, {language: 'zh-tw'});
						});
					} 
				});
			}
		};
		next();
	}
};

function getJSON(website){
}

