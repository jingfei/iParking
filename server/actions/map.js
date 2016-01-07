exports.transTainan = {
	name: 'transTainan',
	description: 'trans tainan\'s open source for parking to our data',
	inputs:{
		website: {required: false},
	},
	outputExample: {},
	run: function(api, data, next){
		api.map.transTainan(data.params.website, function(error, result){
			data.response.result = result;
			next(error);
		});
	}
};

exports.addGPS = {
	name: 'addGPS',
	description: 'recieve GPS and image from phone',
	inputs:{
		GPSlat: {required: true},
		GPSlng: {required: true},
		img: {required: false},
	},
	outputExample: {},
	run: function(api, data, next){
		api.map.addGPS(data.params.GPSlat, data.params.GPSlng, data.params.img, function(error, result){
			data.response.result = result;
			next(error);
		});
	}
};

exports.searchSpace = {
	name: 'searchSpace',
	description: 'answer the nearest parking space',
	inputs:{
		GPSlat: {required: true},
		GPSlng: {required: true}
	},
	outputExample: {},
	run: function(api, data, next){
		api.map.searchSpace(data.params.GPSlat, data.params.GPSlng, function(error, result){
			data.response.result = result;
			next(error);
		});
	}
};

