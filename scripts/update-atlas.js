const json = require('json-update');
const path = require('path');

const path = '../src/assets/images/units/';
const files = [
	'ath/ath_build01.json'
];

files.forEach(file => {
	const target = path.join(path, file);
	json
		.load(target)
		.then(data => {
			data.frames = data.frames.splice(data.frames.length - 3).concat(data.frames);
			return json.update(target, data);
		})
		.then((err, data) => console.log(`${target} has been updated`));

});

