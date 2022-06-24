import * as THREE from 'three';
import Player from '../../core/player';

class PlayersController {
	players: Player[];

	scene: THREE.Scene;

	playerNames: string[];

	update(name: string, pos: THREE.Vector3, reward: THREE.Vector3) {
		const idx = this.playerNames.findIndex(d => d === name);
		pos && this.players[idx].setPosition(pos);
		reward && this.players[idx].setRotation(reward);
		(pos || reward) && this.players[idx].update();
	}

	init(scene: THREE.Scene, playerNames: string[]) {
		this.scene = scene;
		this.players = playerNames.map((d, i) => new Player({ idx: i, pos: new THREE.Vector3(0, 0, 0) }));
		this.playerNames = [...playerNames];
		this.players.forEach(d => this.scene.add(d.player));
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
		this.playerNames[idx] = null;
		this.scene.remove(this.players[idx].player);
		this.players[idx].player.remove();
		this.players[idx] = null;
	}
}

export default PlayersController;
