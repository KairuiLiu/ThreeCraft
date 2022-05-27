import * as THREE from 'three';
import Core from '../../core';
import { getDir } from '../get-dir';

// TODO: 实现碰撞检测 - 绝对方向
export function collisionCheck({ posX, posY, posZ, dirX, dirY, dirZ, core }) {
	const originPosition = new THREE.Vector3(posX, posY, posZ);
	const direction = new THREE.Vector3(dirX, dirY, dirZ).normalize();
	const directionU = getDir(direction);
	const len = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
	const ray = new THREE.Raycaster(originPosition, direction.clone(), 0, len + 0.2);

	const collisionResults = ray.intersectObjects((core as Core).scene.children, true);
	if (collisionResults.length > 0) {
		return {
			obj: collisionResults[0],
			pos: {
				posX: collisionResults[0].point.x - directionU.x * 0.2,
				posY: collisionResults[0].point.y - directionU.y * 0.2,
				posZ: collisionResults[0].point.z - directionU.z * 0.2,
			},
		};
	}
	return null;
}

// TODO: 实现碰撞检测 - 相对方向
export function relativeCollisionCheck({ posX, posY, posZ, font, left, up, core }) {
	const [dirX, dirY, dirZ] = [font, left, up];
	return collisionCheck({
		posX,
		posY,
		posZ,
		dirX,
		dirY,
		dirZ,
		core,
	});
}
