import deviceTest from '../../utils/device-test';

const config = {
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
		posX: 0,
		posY: 0,
		posZ: 0,
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
};

const defaultConfig = config;

export { config, symConfig, defaultConfig };

// {
// 	bag: {
// 		type: 'pc' | 'mobile' | 'vr';
// 		bagItem: (string | null)[];
// 		activeIndex: number;
// 		mobile: {
// 			rotateDegree: number;
// 			radius: number;
// 		};
// 		bagBox: {
// 			activeIdx: number;
// 		};
// 	};
// 	camera: {
// 		fov: number;
// 		camHeight: number;
// 	};
// 	renderer: {
// 		fog: number;
// 		simulateDistance: number;
// 		renderDistance: number;
// 	};
// 	controller: {
// 		volume: number;
// 		operation: 'pc' | 'mobile' | 'vr';
// 		language: 'cn' | 'en';
// 		dev: boolean;
// 		cheat: boolean;
// 		fps: boolean;
// 	};
// 	state: {
// 		posX: number;
// 		posY: number;
// 		posZ: number;
// 		jumping: boolean;
// 	};
// }
