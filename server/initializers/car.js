var geocoder = require("geocoder");
var fs = require("fs");

module.exports={
	
	initialize: function(api, next){
		var redis = api.redis.client;
		api.car={
			analysisIMG: function(image, next){
				fs.writeFile("./20150522test.jpg", image, 'base64', function(err){
					if(err) next(err);
				});
			},
			getAddress: function(loc_x, loc_y, lang, next){
				var time = new Date().getTime();
				geocoder.reverseGeocode(loc_x, loc_y, function(error, geo){
					var data = {
						createAt: new Date(time).toString(),
						loc: "(" + loc_x + ", " + loc_y + ")",
					};
					/* find road */
					for(i in geo.results){
						for( j in geo.results[i]["address_components"])
							for(k in geo.results[i]["address_components"][j]["types"])
								if(geo.results[i]["address_components"][j]["types"][k]=="route")
									data.road = geo.results[i]["address_components"][j]["long_name"];
					}
					/* find each possible address */
					data.address = new Array();
					for( i in geo.results)
						data.address.push(geo.results[i]["formatted_address"]);
					next(error, data);
				}, {language: lang});
			},
			getData: function(name, loc_x, loc_y, next){
				var data = {
					name: name,
					loc: "(" + loc_x + ", " + loc_y + ")",
					createAt: new Date().getTime(),
					loc_x: loc_x,
					loc_y: loc_y,
				};
				geocoder.reverseGeocode(loc_x, loc_y, function(error, geo){
					data.address = geo.results[0].formatted_address;
					redis.hmset(name, data, function(error){
						next(error);
					});
				});
			},

			loadData: function(name, next){
				redis.hgetall(name, function(error, data){
					var time = parseInt(data.createAt);
					data.createAt = new Date(time).toString();
					next(error, data);
				});
			}
		};

		next();
	}
};
