var geo = require("google-geocoder");
var geocoder = geo({key: 'AIzaSyBsDRrd6d0FIq1rbOp1_Meq4xqQNM61E1g'});
var request = require("request");
var fs = require("fs");
var mongodb = require('mongodb');
var errorRate = 100000;

var mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10 });
var db = new mongodb.Db('bubblegray', mongodbServer);

module.exports={
	
	initialize: function(api, next){
		api.map={
			transTainan: function(website, next){
				if(website==null) website="http://data.tainan.gov.tw/api/action/datastore_search?resource_id=597f3e87-d326-4404-9a64-efc30eeac5e3&limit=300";
				var data = Object();
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
						var total=0, valid=0;
						var line = Array();
						result.forEach(function(res){
							++total;
							var tainan = "台南市";
							var from=tainan + res.行政區 + res.路段名稱.split("-")[0];
							if( from.indexOf("路外") != -1 || from.indexOf("停車場") != -1 || from == tainan) return;
							var to1 =tainan + res.路段說明.split("-")[0];
							var to2 =tainan + res.路段說明.split("-")[1];
							if( (tmp = to1.indexOf("口")) != -1)
								to1 = to1.substr(0, tmp);
							if( (tmp = to2.indexOf("口")) != -1)
								to2 = to2.substr(0, tmp);
							if( to1.indexOf("undefined") != -1 || to2.indexOf("undefined") != -1) return;
							line[total-1] = Object();
							line[total-1].id = total-1;
							line[total-1].from = from;
							line[total-1].to1 = to1;
							line[total-1].to2 = to2;
							geocoder.find(from+', '+to1, function(error, geo){
								if(geo && geo.length){
									line[total-1].dot1 = geo[0].location;
								}
								else data.error = geo;
								geocoder.find(from+', '+to2, function(error, geo2){
									if(geo2 && geo2.length){
										line[total-1].dot2 = geo2[0].location;
										++valid;
									}
									else data.error = geo2;
									if(valid==result.length) {
										data.total = total;
										data.valid = valid;
										data.line = line;
										next(error, data);
									}
								}, {language: 'zh-tw'});
							}, {language: 'zh-tw'});
						});
					} 
				});
			},
			addGPS: function(GPSlat, GPSlng, img, next){
				var time = new Date().getTime();
				var GPSlat = new Number(GPSlat).toFixed(3);
				var GPSlng = new Number(GPSlng).toFixed(3);
				var GPS = [GPSlat, GPSlng];
			//	if(img){
					db.open(function() {
						db.collection('GPSinfo', function(err, collection) {
							collection.findOne({ GPS: GPS }, function(err, data) {
							    /* Found this GPS */
							    if (data) {
									collection.updateOne(
										{GPS: GPS},
										{
											$set: {"stat": data.stat=='yes' ? 'no' : 'yes'} 
										}, function(err, res){
											next(err, data);
									});
							    } else {
									api.car.getAddress(GPSlat, GPSlng, 'zh_tw', function(err, res){
										var road = res.road;
										collection.insert({
											time: time,
											GPS: [GPSlat, GPSlng],
											road: road,
											stat: 'yes'
										}, function(err, data) {
											next(err, data);
										});
									});
							    }
							});
						});
					});
			//	}
			},
			searchSpace: function(GPSlat, GPSlng, next){
				var result = {};
				db.open(function() {
					var findres = db.collection('GPSinfo').find();
					var len = db.collection('GPSinfo').count();
					var count = 0;
					findres.each(function(err, data){
						if(data && data.GPS != null && data.stat=='yes'){
							/* transfer unit from lat, lng to meter */
							var g = data.GPS;
							var lat1 = g[0]*Math.PI / 180;
							var lat2 = GPSlat*Math.PI / 180;
							var lng1 = g[1]*Math.PI / 180;
							var lng2 = GPSlng*Math.PI / 180;
							var a = lat1 - lat2, b = lng1 - lng2;
							var dis = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a*0.5),2) + Math.cos(lat1)*Math.cos(lat2)*Math.pow(Math.sin(b*0.5),2) ));
							dis = dis * 6378137;
							dis = dis.toFixed(2);

							if(dis < errorRate){
								var road = data.road;
								if(!result[road]) result[road] = {};
								result[road].count = result[road].count ? result[road].count+1 : 1;
								if(!result[road].dis || result[road].dis>dis){
									result[road].GPSlat = g[0];
									result[road].GPSlng = g[1];
									result[road].dis = dis;
								}
							}
						}
						if(++count == len._result+1) next(err, result);
					});
				});
			}
		};
		next();
	}
};

function getJSON(website){
}

