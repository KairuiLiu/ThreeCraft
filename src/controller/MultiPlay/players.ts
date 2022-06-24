import * as THREE from 'three';
import Player from '../../core/player';
import { skinsMap } from '../../core/loader';
import { config } from '../config';

class PlayersController {
	players: Player[];

	scene: THREE.Scene;

	playerNames: string[];

	constructor() {
		this.players = [];
		this.playerNames = [];
	}

	update(name: string, pos: THREE.Vector3, reward: THREE.Euler) {
		this.players.forEach(d => {
			if (!d) return;
			if (Math.abs(d.position.x - config.state.posX) > config.renderer.stageSize / 2 || Math.abs(d.position.z - config.state.posZ) > config.renderer.stageSize / 2) d.player.visible = false;
			else d.player.visible = true;
		});
		const idx = this.playerNames.findIndex(d => d === name);
		if (idx === -1) return;
		pos && this.players[idx].setPosition(pos);
		reward && this.players[idx].setRotation(reward);
		(pos || reward) && this.players[idx].update();
	}

	init(roomId, scene: THREE.Scene, playerNames: string[]) {
		const st = Number.parseInt(roomId, 36);
		this.scene = scene;
		this.players = playerNames.map((d, i) => (d === null ? null : new Player({ idx: (st + i) % skinsMap.length, pos: new THREE.Vector3(0, 0, 0), reward: new THREE.Euler(0, 0, 0, 'YXZ') })));
		this.playerNames = [...playerNames];
		this.addScene();
	}

	addScene() {
		this.players.forEach(d => {
			d && this.scene.add(d.player);
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
