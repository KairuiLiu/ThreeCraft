const config: {
	bag: {
		type: 'pc' | 'mobile' | 'vr';
		bagItem: (string | null)[];
		availableBlock: string[];
		activeIndex: number;
		mobile: {
			rotateDegree: number;
			radius: number;
		};
	};
} = {
	bag: {
		type: 'pc',
		bagItem: ['Granite', 'Lava', 'Ice'],
		availableBlock: ['Granite', 'Lava', 'Ice', 'Granite', 'Lava', 'Ice', 'Granite', 'Lava', 'Ice'],
		activeIndex: 2,
		mobile: {
			rotateDegree: 12,
			radius: 300,
		},
	},
};

export default config;
