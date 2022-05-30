import deviceTest from '../../utils/device-test';
import langCN from '../../assets/lang/zh_cn';
import langEN from '../../assets/lang/en_us';
import { deepClone } from '../../utils/deep-clone';

const config = {
	seed: null,
	cloudSeed: null,
	treeSeed: null,
	weather: null,
	bag: {
		type: deviceTest(),
		bagItem: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
		activeIndex: 2,
		mobile: {
			rotateDegree: 12.5,
			radius: 233,
		},
		bagBox: {
			activeIdx: 0,
		},
	},
	camera: {
		fov: 100,
		camHeight: 2,
	},
	renderer: {
		fog: 0.02,
		stageSize: 36, // stage的边长 196
		renderDistance: 500,
	},
	controller: {
		thread: 4,
		volume: 80,
		operation: deviceTest(),
		language: '0',
		cheat: true,
		dev: true,
		fps: true,
		crosshair: 'dark',
		opSens: 1,
		opRange: 8,
	},
	state: {
		posX: 0,
		posY: 0,
		posZ: 20,
	},
};

const symConfig = {
	stage: {
		skyBackground: 0x87ceeb,
		maxHeight: 30,
		horizonHeight: 7,
	},
	actionsScale: {
		walking: 5,
		jump: 7,
		fall: 7,
		cheatFactor: 2,
		moveScale: 0.02,
		viewScale: 0.005,
		g: 0.007,
	},
	body: {
		length: 0.7,
		width: 0.5,
		height: 1.8,
	},
};

const defaultConfig = {
	seed: null,
	cloudSeed: null,
	treeSeed: null,
	weather: null,
	bag: {
		type: deviceTest(),
		bagItem: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
		activeIndex: 2,
		mobile: {
			rotateDegree: 12.5,
			radius: 233,
		},
		bagBox: {
			activeIdx: 0,
		},
	},
	camera: {
		fov: 100,
		camHeight: 2,
	},
	renderer: {
		fog: 0.02,
		stageSize: 36,
		renderDistance: 500,
	},
	controller: {
		thread: 4,
		volume: 80,
		operation: deviceTest(),
		language: '0',
		cheat: true,
		dev: true,
		fps: true,
		crosshair: 'dark',
		opSens: 1,
		opRange: 8,
	},
	state: {
		posX: 0,
		posY: 0,
		posZ: 20,
	},
};

const languages = [langCN, langEN];

const langIdx = /^\/en/.test(document.location.pathname) ? 1 : 0;

const language = deepClone(languages[langIdx]);
defaultConfig.controller.language = `${langIdx}`;
config.controller.language = `${langIdx}`;

export { config, symConfig, defaultConfig, language, languages };
