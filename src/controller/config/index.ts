import deviceTest from '../../utils/device-test';

const config = {
	berlinSeed: null,
	bag: {
		type: deviceTest(),
		bagItem: ['Grass_Block', 'Diorite', 'Dark_Oak_Leaves', 'Gold_Ore', 'Water', 'Coal_Ore', 'Glass', 'Slime_Block', 'Emerald_Ore', 'Block_of_Diamond'],
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
		fog: 0.2,
		simulateDistance: 100,
		renderDistance: 500,
	},
	controller: {
		volume: 80,
		operation: deviceTest(),
		language: 'cn',
		cheat: false,
		dev: false,
		fps: true,
	},
	state: {
		posX: 6,
		posY: 37,
		posZ: 6,
		jumping: false,
	},
};

const symConfig = {
	bag: {
		bagBox: {
			allItems: [
				'Acacia_Wood',
				'Andesite',
				'Block_of_Diamond',
				'Block_of_Gold',
				'Block_of_Iron',
				'Brick_Block',
				'Coal_Ore',
				'Diorite',
				'Glass',
				'Gold_Ore',
				'Grass_Block',
				'Slime_Block',
				'End_Stone',
				'Lava',
				'TNT',
				'Netherrack',
				'Purpur_Block',
				'Water',
				'Wood',
				'Nether_Quartz_Ore',
				'Stone',
				'Birch_Wood',
				'Red_Sand',
				'Red_Sandstone',
				'Melon',
				'Grid_Red_Mushroom',
				'Chest',
				'Block_of_Coal',
				'Slime_Block',
				'Mycelium',
				'Moss_Stone',
				'End_Portal_Frame',
				'Beacon',
			],
		},
	},
	camera: {
		initPosition: { x: 6, y: 37, z: 6 },
		lookAt: { x: 6, y: 37, z: 6 },
	},
	stage: {
		// skyBackground: 0x87ceeb,
		skyBackground: 0x222222,
	},
	speed: {
		walking: 5,
		jump: 7,
		fall: 7,
		cheatFactor: 2,
	},
	body: {
		length: 0.7,
		width: 0.5,
		height: 1.8,
	},
};

const defaultConfig = {
	berlinSeed: null,
	bag: {
		type: deviceTest(),
		bagItem: ['Grass_Block', 'Diorite', 'Dark_Oak_Leaves', 'Gold_Ore', 'Water', 'Coal_Ore', 'Glass', 'Slime_Block', 'Emerald_Ore', 'Block_of_Diamond'],
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
		fog: 0.2,
		simulateDistance: 100,
		renderDistance: 500,
	},
	controller: {
		volume: 80,
		operation: deviceTest(),
		language: 'cn',
		cheat: false,
		dev: false,
		fps: true,
	},
	state: {
		posX: 6,
		posY: 37,
		posZ: 6,
		jumping: false,
	},
};

export { config, symConfig, defaultConfig };
