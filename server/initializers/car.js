var geocoder = require("geocoder");
var fs = require("fs");

module.exports={
	
	initialize: function(api, next){
		var redis = api.redis.client;
		api.car={
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
			getLoc: function(addr, lang, next){
				var time = new Date().getTime();
				geocoder.geocode(addr, function(error, geo){
					var data = {
						createAt: new Date(time).toString(),
						addr: addr,
					};
					data.loc_x=geo.results[0].geometry.location.lat;
					data.loc_y=geo.results[0].geometry.location.lng;
					next(error, data);
				}, {language: lang});
			},
			analysisIMG: function(image, next){
				var fileName = "./public/upload.jpg";
				fs.writeFile(fileName, image, 'base64', function(err){
					var exec = require('child_process').exec,
						child,
						result = {stdout: "", stderr: ""};
					child = exec('/home/bubblegray/iParking/lot/test '+fileName, 
								{env:
									{'OpenCV': '"`pkg-config --cflags --libs opencv`"',
									 'DISPLAY': ':0.0',
									 'XAUTHORITY': '/home/bubblegray/.Xauthority'
									}
								},
								function(err,stdout,stderr){
						result["stdout"] = stdout;
						result["stderr"] = stderr;
						next(err, result);
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
