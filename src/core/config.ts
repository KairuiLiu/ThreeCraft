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
};

export { config, symConfig };
