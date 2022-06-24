import * as THREE from 'three';
import Player from '../../core/player';

class PlayersController {
	players: Player[];

	scene: THREE.Scene;

	playerNames: string[];

	constructor() {
		this.players = [];
		this.playerNames = [];
	}

	update(name: string, pos: THREE.Vector3, reward: THREE.Euler) {
		const idx = this.playerNames.findIndex(d => d === name);
		if (idx === -1) return;
		pos && this.players[idx].setPosition(pos);
		reward && this.players[idx].setRotation(reward);
		(pos || reward) && this.players[idx].update();
	}

	init(scene: THREE.Scene, playerNames: string[]) {
		this.scene = scene;
		this.players = playerNames.map((d, i) => new Player({ idx: i, pos: new THREE.Vector3(0, 0, 0), reward: new THREE.Euler(0, 0, 0, 'YXZ') }));
		this.playerNames = [...playerNames];
		this.players.forEach(d => {
			this.scene.add(d.player);
		});
	}

	removeAll() {
		this.playerNames = [];
		this.players.forEach(d => {
			if (d === null) return;
			this.scene.remove(d.player);
			d.player.remove();
			d = null;
		});
		this.players = [];
	}

	removePlayer(playerName) {
		const idx = this.playerNames.findIndex(d => d === playerName);
		if (idx === -1) return;
		this.playerNames[idx] = null;
		this.scene.remove(this.players[idx].player);
		this.players[idx].player.remove();
		this.players[idx] = null;
	}
}

export default PlayersController;
