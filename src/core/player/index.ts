import * as THREE from 'three';
import { symConfig } from '../../controller/config';
import playerObject from './playerObject';

class Player {
	obj: THREE.Group;

	material: THREE.MeshStandardMaterial;

	mesh: THREE.Mesh;

	target: THREE.Vector3;

	position: THREE.Vector3;

	rotation: THREE.Euler;

	lastCall: number;

	animateStamp: number;

	constructor({ idx, pos }) {
		this.obj = playerObject.clone();
		// TODO
		this.material = new THREE.MeshStandardMaterial({});
		this.mesh = new THREE.Mesh();
		this.position = pos.clone();
		this.target = this.position.clone();
		this.rotation = new THREE.Euler();
		this.animateStamp = 0;
		this.lastCall = performance.now();
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
		this.mesh.position.copy(this.position);
	}

	updateReward() {
		this.mesh.rotation.copy(this.rotation);
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
		this.position.copy(v);
	}

	setRotation(v) {
		this.rotation.copy(v);
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
