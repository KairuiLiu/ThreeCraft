const config: {
	bag: {
		type: 'pc' | 'mobile' | 'vr';
		bagItem: (string | null)[];
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
		activeIndex: 0,
		mobile: {
			rotateDegree: 12,
			radius: 300,
		},
	},
};

export default config;
