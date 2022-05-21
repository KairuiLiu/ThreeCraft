const symConfig: {
	bag: {
		bagBox: {
			allItems: (string | null)[];
		};
	};
} = {
	bag: {
		bagBox: {
			allItems: ['Granite', 'Lava', 'Ice', 'Granite', 'Lava', 'Ice', 'Granite', 'Lava', 'Ice'],
		},
	},
};

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
			activeItems: (string | null)[];
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
		bagItem: ['Granite', 'Lava', 'Ice'],
		activeIndex: 2,
		mobile: {
			rotateDegree: 12,
			radius: 300,
		},
		bagBox: {
			activeItems: [],
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

export { config, symConfig };
