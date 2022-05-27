import * as THREE from 'three';
import Core from '../../core';
import { getDir } from '../get-dir';

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

export function relativeCollisionCheck({ posX, posY, posZ, font, left, up, core }) {
	const absoluteMove = new THREE.Vector3(-left, up, -font);
	const revMat = new THREE.Matrix3();
	revMat.setFromMatrix4(core.camera.matrixWorld);
	absoluteMove.applyMatrix3(revMat);
	return collisionCheck({
		posX,
		posY,
		posZ,
		dirX: absoluteMove.x,
		dirY: absoluteMove.y,
		dirZ: absoluteMove.z,
		core,
	});
}
