// eslint-disable-next-line
enum actionMoveEvent {
	FONT,
	BACK,
	LEFT,
	RIGHT,
	UP,
	DOWN,
}

// eslint-disable-next-line
enum actionKeyEvent {
	LEFT,
	RIGHT,
}

class Controller {
	startGame(single: boolean) {
		console.log('game start');
		console.log('single', single);
		this;
	}

	handleMoveAction(key) {
		this;
		console.log(key);
	}

	handleBlockAction(key) {
		this;
		console.log('type', key);
	}

	toggleCheatMode() {
		this;
		console.log('cheat');
	}
}

export { Controller, actionMoveEvent, actionKeyEvent };
