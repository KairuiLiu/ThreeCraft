const config: {
	bag: {
		type: 'pc' | 'mobile' | 'vr';
		bagItem: (string | null)[];
		activeIndex: number;
		mobile: {
			rotateDegree: number;
			radius: number;
		};
		bagBox: {
			activeIdx: number;
		};
	};
	camera: {
		fov: number;
		camHeight: number;
	};
	renderer: {
		fog: number;
		simulateDistance: number;
		renderDistance: number;
	};
	controller: {
		volume: number;
		operation: 'pc' | 'mobile' | 'vr';
		language: 'cn' | 'en';
	};
} = {
	bag: {
		type: 'pc',
		bagItem: ['Grass_Block', 'Diorite', 'Dark_Oak_Leaves', 'Gold_Ore', 'Water', 'Coal_Ore', 'Glass', 'Slime_Block', 'Emerald_Ore', 'Block_of_Diamond'],
		activeIndex: 2,
		mobile: {
			rotateDegree: 12,
			radius: 300,
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
		renderDistance: 100,
	},
	controller: {
		volume: 80,
		operation: 'pc',
		language: 'cn',
	},
};

const symConfig: {
	bag: {
		bagBox: {
			allItems: (string | null)[];
		};
	};
} = {
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
};

export { config, symConfig };
