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
	'fed/fed_build14.json',

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

	'syl/syl_build01.json',
	'syl/syl_build02.json',
	'syl/syl_build03.json',
	'syl/syl_build04.json',
	'syl/syl_build05.json',
	'syl/syl_build06.json',
	'syl/syl_build07.json',
	'syl/syl_build08.json',
	'syl/syl_build09.json',
	'syl/syl_build10.json',
	'syl/syl_build11.json',
	'syl/syl_build12.json',
	'syl/syl_build13.json',
	'syl/syl_build14.json',

	'syl/syl_unit01.json',
	'syl/syl_unit02.json',
	'syl/syl_unit03.json',
	'syl/syl_unit04.json',
	'syl/syl_unit05.json',
	'syl/syl_unit06.json',
	'syl/syl_unit07.json',
	'syl/syl_unit08.json',
	'syl/syl_unit09.json',
	'syl/syl_unit10.json',
	'syl/syl_unit11.json',
	'syl/syl_unit12.json',
	'syl/syl_unit13.json',
	'syl/syl_unit14.json',			

	'tho/tho_build01.json',
	'tho/tho_build02.json',
	'tho/tho_build03.json',
	'tho/tho_build04.json',
	'tho/tho_build05.json',
	'tho/tho_build06.json',
	'tho/tho_build07.json',
	'tho/tho_build08.json',
	'tho/tho_build09.json',
	'tho/tho_build10.json',
	'tho/tho_build11.json',
	'tho/tho_build12.json',
	'tho/tho_build13.json',
	'tho/tho_build14.json',

	'tho/tho_unit01.json',
	'tho/tho_unit02.json',
	'tho/tho_unit03.json',
	'tho/tho_unit04.json',
	'tho/tho_unit05.json',
	'tho/tho_unit06.json',
	'tho/tho_unit07.json',
	'tho/tho_unit08.json',
	'tho/tho_unit09.json',
	'tho/tho_unit10.json',
	'tho/tho_unit11.json',
	'tho/tho_unit12.json',
	'tho/tho_unit13.json',

	'zho/zho_build01.json',
	'zho/zho_build02.json',
	'zho/zho_build03.json',
	'zho/zho_build04.json',
	'zho/zho_build05.json',
	'zho/zho_build06.json',
	'zho/zho_build07.json',
	'zho/zho_build08.json',
	'zho/zho_build09.json',
	'zho/zho_build10.json',
	'zho/zho_build11.json',
	'zho/zho_build12.json',
	'zho/zho_build13.json',
	'zho/zho_build14.json',
	'zho/zho_build15.json',

	'zho/zho_unit01.json',
	'zho/zho_unit02.json',
	'zho/zho_unit03.json',
	'zho/zho_unit04.json',
	'zho/zho_unit05.json',
	'zho/zho_unit06.json',
	'zho/zho_unit07.json',
	'zho/zho_unit08.json',
	'zho/zho_unit09.json',
	'zho/zho_unit10.json',
	'zho/zho_unit11.json',
	'zho/zho_unit12.json',
	'zho/zho_unit13.json',
	'zho/zho_unit14.json',
	'zho/zho_unit15.json',
	'zho/zho_unit16.json', */

	'ast/asteroid01.json',
	'ast/asteroid02.json',
	'ast/asteroid03.json',
	'ast/asteroid04.json',

	'ast/asteroid_sm01.json',
	'ast/asteroid_sm02.json',
	'ast/asteroid_sm03.json',
	'ast/asteroid_sm04.json',
	
	'ast/asteroid_big01.json',
	'ast/asteroid_big02.json',
	
	'ast/asteroid_ice01.json',
	'ast/asteroid_ice02.json',
	'ast/asteroid_ice_sm01.json',
	'ast/asteroid_ice_sm02.json',

	'ast/asteroid_silicon01.json',
	'ast/asteroid_silicon02.json',
	'ast/asteroid_silicon_sm01.json',
	'ast/asteroid_silicon_sm02.json',

	'ast/asteroid_titanium01.json',
	'ast/asteroid_titanium02.json',
	'ast/asteroid_titanium_sm01.json',
	'ast/asteroid_titanium_sm02.json',

	'ast/asteroid_uranium01.json',
	'ast/asteroid_uranium02.json',
	'ast/asteroid_uranium_sm01.json',
	'ast/asteroid_uranium_sm02.json',

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

			newData.frames.unshift(tmp);

			/*if (tmp.filename.indexOf('_sm_') !== -1) {
				newData.frames[1] = Object.assign({}, newData.frames[2]);
				newData.frames[2] = tmp; 
			}*/

			return jsonFile.writeFile(target, newData, {spaces: 2});
		})
		.then((err, data) => console.log(`${target} has been updated`));

});

