exports.transTainanFrom = {
	name: 'transTainanFrom',
	description: 'trans tainan\'s open source for parking to our data',
	inputs:{
		website: {required: false},
	},
	outputExample: {},
	run: function(api, data, next){
		api.map.transTainanFrom(data.params.website, function(error, result){
			data.response.result = result;
			next(error);
		});
	}
};

exports.transTainanTo = {
	name: 'transTainanTo',
	description: 'trans tainan\'s open source for parking to our data',
	inputs:{
		website: {required: false},
	},
	outputExample: {},
	run: function(api, data, next){
		api.map.transTainanTo(data.params.website, function(error, result){
			data.response.result = result;
			next(error);
		});
	}
};

