exports.getData = {
  name: 'getData',
  description: 'just test here',

  inputs:{
		name: {required: true},
		loc_y: {required: true},
		loc_x: {required: true},
  },
   
  outputExample:{},

  run: function(api, data, next){
		api.car.getData(data.params.name, data.params.loc_x, data.params.loc_y, function(error){
    	next(error);
  	});
	}
};

exports.loadData = {
	name: 'loadData',
	description: 'test load redis',
	inputs:{
		name: {required: true},
	},
	outputExample: {},
	run: function(api, data, next){
		api.car.loadData(data.params.name, function(error, result){
			data.response.result = result;
			next(error);
		});
	}
};

exports.getAddress = {
	name: 'getAddress',
	description: 'test road name',
	inputs:{
		loc_x: {required: true},
		loc_y: {required: true},
		lang: {required: false},
	},
	outputExample: {
		 "result": {
			 "createAt": "Thu May 21 2015 23:07:49 GMT+0800 (CST)",
			 "loc": "(12.123456, 123.123456)",
			 "address": "Balud Road, Balud, Masbate, Philippines"
		 },
	},
	run: function(api, data, next){
		api.car.getAddress(data.params.loc_x, data.params.loc_y, data.params.lang, function(error, result){
			data.response.result = result;
			next(error);
		});
	}
};

exports.analysisIMG = {
	name: 'analysisIMG',
	description: 'test image analysis',
	inputs:{
		image: {required: true},
	},
	outputExample: {
		 "result": {
		 },
	},
	run: function(api, data, next){
		api.car.analysisIMG(data.params.image, function(error, result){
			data.response.result = result;
			next(error);
		});
	}
};

