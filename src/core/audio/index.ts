import Core from '..';

class Audio {
	loaded: boolean;

	core: Core;

	constructor(core) {
		this.core = core;
		this.loaded = true;
	}
}

export default Audio;
