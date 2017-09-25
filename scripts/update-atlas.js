const json = require('json-update');
const jsonFile = require('jsonfile');
const beautify = require("json-beautify");
const path = require('path');

const dir = '../src/assets/images/units/';
const files = [

/*	'ath/ath_build01.json',
	'ath/ath_build02.json',
	'ath/ath_build03.json',
	'ath/ath_build04.json',
	'ath/ath_build05.json',
	'ath/ath_build06.json',
	'ath/ath_build07.json',
	'ath/ath_build08.json',
	'ath/ath_build09.json',
	'ath/ath_build10.json',
	'ath/ath_build11.json',
	'ath/ath_build12.json',
	'ath/ath_build13.json',
	'ath/ath_build14.json',

	'ath/ath_unit01.json',
	'ath/ath_unit02.json',
	'ath/ath_unit03.json',
	'ath/ath_unit04.json',
	'ath/ath_unit05.json',
	'ath/ath_unit06.json',
	'ath/ath_unit07.json',
	'ath/ath_unit08.json',
	'ath/ath_unit09.json',
	'ath/ath_unit10.json',
	'ath/ath_unit11.json',
	'ath/ath_unit12.json',
	'ath/ath_unit13.json',

	'fed/fed_build01.json',
	'fed/fed_build02.json',
	'fed/fed_build03.json',
	'fed/fed_build04.json',
	'fed/fed_build05.json',
	'fed/fed_build06.json',
	'fed/fed_build07.json',
	'fed/fed_build08.json',
	'fed/fed_build09.json',
	'fed/fed_build10.json',
	'fed/fed_build11.json',
	'fed/fed_build12.json',
	'fed/fed_build13.json',
	'fed/fed_build14.json',*/

	'fed/fed_unit01.json',
	'fed/fed_unit02.json',
	'fed/fed_unit03.json',
	'fed/fed_unit04.json',
	'fed/fed_unit05.json',
	'fed/fed_unit06.json',
	'fed/fed_unit07.json',
	'fed/fed_unit08.json',
	'fed/fed_unit09.json',
	'fed/fed_unit10.json',
	'fed/fed_unit11.json',
	'fed/fed_unit12.json',
	'fed/fed_unit13.json',
	'fed/fed_unit14.json',	

];

files.forEach(file => {
	const target = path.join(dir, file);
	json
		.load(target)
		.then(data => {
			/*const prefix = file.substring(0, 3);
			const suffix = file.substring(4, 4); 
			const newData = Object.assign({}, data);
			const icons = newData.frames.splice(newData.frames.length - 3);
			const iconsSorted = [
				icons.filter(data => data.filename.indexOf('construct') !== -1)[0],
				icons.filter(data => data.filename.indexOf(`ico_${prefix}_${suffix}`) !== -1)[0],
				icons.filter(data => data.filename.indexOf(`ico_${prefix}_sm_${suffix}`) !== -1)[0]
			];*/
			const newData = Object.assign({}, data);
			const tmp = Object.assign({}, newData.frames[1]);
			newData.frames[1] = Object.assign({}, newData.frames[2]);
			newData.frames[2] = tmp; 
			return jsonFile.writeFile(target, newData, {spaces: 2});
		})
		.then((err, data) => console.log(`${target} has been updated`));

});

