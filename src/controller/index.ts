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
enum actionBlockEvent {
	ADD,
	REMOVE,
}

class Controller {
	startGame(single: boolean) {
		console.log('game start');
		console.log('single', single);
		this;
	}

	handleMoveAction({ font, left, up }) {
		this;
		console.log({ font, left, up });
	}

	handleBlockAction(key: actionBlockEvent) {
		this;
		console.log('type', key);
	}

	toggleCheatMode() {
		this;
		console.log('cheat');
	}
}

export { Controller, actionMoveEvent, actionBlockEvent };
