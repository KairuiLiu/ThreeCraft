import * as THREE from 'three';
import { skinsMap } from '../loader/index';
import { symConfig } from '../../controller/config';
import { PlayerObject } from './playerObject';

class Player {
	player: PlayerObject;

	target: THREE.Vector3;

	position: THREE.Vector3;

	rotation: THREE.Euler;

	lastCall: number;

	animateStamp: number;

	constructor({ idx, pos, reward }: { idx: number; pos: THREE.Vector3; reward: THREE.Euler }) {
		this.player = new PlayerObject(skinsMap[idx]);
		this.position = pos.clone();
		this.target = this.position.clone();
		this.rotation = reward.clone();
		this.animateStamp = 0;
		this.lastCall = performance.now();
		this.player.name = `player_${idx}`;
		this.player.scale.copy(new THREE.Vector3(1 / 16, 1 / 16, 1 / 16));
		this.update();
	}

	update() {
		let delta = this.lastCall;
		this.lastCall = performance.now();
		delta = this.lastCall - delta;

		this.updatePosition(delta);
		this.updateReward();
		if (this.target.clone().sub(this.position).length() <= symConfig.eps) this.resetAnimate();
		else this.reqAnimate(delta);
		// this.mesh.matrixWorldNeedsUpdate = true;
	}

	updatePosition(delta: number) {
		const move = this.target.clone().sub(this.position).normalize().multiplyScalar(this.speedWalking);
		const realMove = this.target.clone().sub(this.position).normalize().multiplyScalar(this.speedWalking);
		realMove.y *= this.speedJump / this.speedWalking;
		realMove.multiplyScalar(delta / 300);
		this.position.add(realMove.length() > move.length() ? move : realMove);
		this.player.position.copy(this.position);
	}

	updateReward() {
		this.player.rotation.copy(this.rotation);
	}

	reqAnimate(delta) {
		this.animateStamp += delta;
		if (this.animateStamp >= 2 * Math.PI) this.animateStamp -= 2 * Math.PI;
		this.setAnimate();
	}

	resetAnimate() {
		this.animateStamp = 0;
		this.setAnimate();
	}

	setAnimate() {
		// TODO ANIMATE
		this;
	}

	setPosition(v) {
		this.position = new THREE.Vector3(v.x, v.y - 0.25, v.z);
	}

	setRotation(v) {
		this.rotation = new THREE.Euler(0, v.y + Math.PI, 0, 'YXZ');
	}

	get speedWalking() {
		return symConfig.actionsScale.walking * symConfig.actionsScale.moveScale;
		this;
	}

	get speedJump() {
		return symConfig.actionsScale.jump * symConfig.actionsScale.moveScale;
		this;
	}
}

export default Player;
