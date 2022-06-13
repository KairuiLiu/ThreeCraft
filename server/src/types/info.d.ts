declare interface iBlockLog {
	type: string | null;
	posX: number;
	posY: number;
	posZ: number;
	action?: actionBlockEvent;
}

declare interface iInitConfig {
	seed: number;
	cloudSeed: number;
	treeSeed: number;
	weather: number;
	state: {
		posX: number;
		posY: number;
		posZ: number;
	};
	log: iBlockLog;
}
