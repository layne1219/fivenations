const json = require('json-update');
const beautify = require("json-beautify");
const path = require('path');

const dir = '../src/assets/images/units/';
const files = [
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

];

files.forEach(file => {
	const target = path.join(dir, file);
	json
		.load(target)
		.then(data => {
			const newData = Object.assign({}, data);
			newData.frames = newData.frames.splice(newData.frames.length - 3).concat(newData.frames);
			return json.update(target, beautify(newData, null, 2));
		})
		.then((err, data) => console.log(`${target} has been updated`));

});

