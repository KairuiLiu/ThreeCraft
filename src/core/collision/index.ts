import * as THREE from 'three';
import { generateFragSync } from '../terrain/generate/generateFragSync';
import { symConfig, config } from '../../controller/config';
import { getDir } from '../../utils/get-dir';

const needCheck = [
	[
		// 前
		[
			// 左
			[8, 1, 2, 3, 4, 5, 6, 0], // 下
			[8, 1, 2, 3, 5, 6, 0], // 不上
			[8, 1, 2, 3, 5, 6, 7, 0], // 上
		],
		[
			// 不左
			[8, 1, 2, 3, 4, 5, 0], // 下
			[8, 1, 2, 3, 0], // 不上
			[8, 1, 2, 3, 6, 7, 0], // 上
		],
		[
			// 右
			[8, 1, 2, 3, 4, 5, 7, 0], // 下
			[8, 1, 2, 3, 4, 7, 0], // 不上
			[8, 1, 2, 3, 4, 6, 7, 0], // 上
		],
	],

	[
		// 不前
		[
			// 左
			[8, 1, 2, 4, 5, 6, 0], // 下
			[8, 1, 2, 5, 6], // 不上
			[8, 1, 2, 3, 5, 6, 7], // 上
		],
		[
			// 不左
			[8, 1, 4, 5, 0], // 下
			[], // 不上
			[8, 2, 3, 6, 7], // 上
		],
		[
			// 右
			[8, 1, 3, 4, 5, 7, 0], // 下
			[8, 0, 3, 4, 7], // 不上
			[8, 2, 3, 4, 6, 7, 0], // 上
		],
	],
	[
		// 后
		[
			// 左
			[8, 1, 2, 4, 5, 6, 7, 0], // 下
			[8, 1, 2, 4, 5, 6, 7], // 不上
			[8, 1, 2, 3, 4, 5, 6, 7], // 上
		],
		[
			// 不左
			[8, 1, 4, 5, 6, 7, 0], // 下
			[8, 4, 5, 6, 7], // 不上
			[8, 2, 3, 4, 5, 6, 7], // 上
		],
		[
			// 右
			[8, 1, 3, 4, 5, 6, 7, 0], // 下
			[8, 3, 4, 5, 6, 7, 0], // 不上
			[8, 2, 3, 4, 5, 6, 7, 0], // 上
		],
	],
];

const dirs = [
	new THREE.Vector3(+symConfig.body.eyeRight, -symConfig.body.eyeButton, -symConfig.body.eyeFront),
	new THREE.Vector3(-symConfig.body.eyeLeft, -symConfig.body.eyeButton, -symConfig.body.eyeFront),
	new THREE.Vector3(-symConfig.body.eyeLeft, +symConfig.body.eyeUp, -symConfig.body.eyeFront),
	new THREE.Vector3(+symConfig.body.eyeRight, +symConfig.body.eyeUp, -symConfig.body.eyeFront),
	new THREE.Vector3(+symConfig.body.eyeRight, -symConfig.body.eyeButton, +symConfig.body.eyeBack),
	new THREE.Vector3(-symConfig.body.eyeLeft, -symConfig.body.eyeButton, +symConfig.body.eyeBack),
	new THREE.Vector3(-symConfig.body.eyeLeft, +symConfig.body.eyeUp, +symConfig.body.eyeBack),
	new THREE.Vector3(+symConfig.body.eyeRight, +symConfig.body.eyeUp, +symConfig.body.eyeBack),
	new THREE.Vector3(0, 0, 0),
];

/**
 *
 * @param posX/Y/Z: 发射点x/y/z
 * @param dirX/Y/Z: 绝对方向x/y/z
 * @param boundingBox: 附近地形
 * @returns null: 没有碰撞
 * @returns {obj: 碰撞物体, pos: 碰撞点}
 */
export function collisionCheck({ posX, posY, posZ, dirX, dirY, dirZ, boundingBox, access }) {
	const originPosition = new THREE.Vector3(posX, posY, posZ);
	const direction = new THREE.Vector3(dirX, dirY, dirZ);
	const len = direction.length();
	const ray = new THREE.Raycaster(originPosition, direction.clone().normalize(), 0, len + 0.1);

	if (!boundingBox)
		boundingBox = generateFragSync(
			posX - 3 - Math.ceil(len),
			posX + 3 + Math.ceil(len),
			posZ - 3 - Math.ceil(len),
			posZ + 3 + Math.ceil(len),
			posY - 3 - Math.ceil(len),
			posY + 3 + Math.ceil(len),
			true
		);

	const collisionResults = ray.intersectObjects(boundingBox.group.children, access);
	if (collisionResults.length > 0) {
		direction.multiplyScalar(collisionResults[0].distance);
		return {
			obj: collisionResults[0],
			pos: {
				posX: collisionResults[0].point.x,
				posY: collisionResults[0].point.y,
				posZ: collisionResults[0].point.z,
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
		boundingBox: null,
		access: false,
	});
}

/**
 *
 * @param posX/Y/Z: 相机位置
 * @param font/left/up: 相对方向x/y/z
 * @param Core: 场景
 * @returns null: 没有碰撞
 * @returns {obj: 碰撞物体, pos: 请纠正相机坐标到}
 */
export function relativeCollisionCheckAll({ posX, posY, posZ, font, left, up, core }) {
	// relative direction camera will move
	const dirU = getDir(new THREE.Vector3(-left, up, -font));

	const origin = new THREE.Vector3(posX, posY, posZ);
	const eulerRotate = new THREE.Euler(0, core.camera.rotation.y, 0, 'YXZ');

	// absolute direction it will move
	const scaleXOZ = symConfig.actionsScale.walking * symConfig.actionsScale.moveScale * config.controller.opSens;
	const scaleOY = symConfig.actionsScale.jump * symConfig.actionsScale.moveScale * config.controller.opSens;
	const absolute = new THREE.Vector3(-left, up, -font).applyEuler(eulerRotate);
	absolute.x *= scaleXOZ;
	absolute.z *= scaleXOZ;
	absolute.y *= scaleOY;

	// generate bounding-box
	const maxMove = Math.ceil(absolute.length());
	const boundingBox = generateFragSync(posX - 3 - maxMove, posX + 3 + maxMove, posZ - 3 - maxMove, posZ + 3 + maxMove, posY - 5 - maxMove, posY + 5 + maxMove, true);

	// nearest position it will collision
	let fstColX = null;
	let fstColY = null;
	let fstColZ = null;

	needCheck[dirU.z + 1][dirU.x + 1][dirU.y + 1].forEach(d => {
		const innerDir = dirs[d].clone().applyEuler(eulerRotate);
		const from = origin.clone().add(innerDir);

		// collision X
		const collisionX = collisionCheck({
			posX: from.x,
			posY: from.y,
			posZ: from.z,
			dirX: absolute.x,
			dirY: 0,
			dirZ: 0,
			boundingBox,
			access: true,
		});
		if (collisionX && (fstColX === null || collisionX.obj.distance < fstColX.obj.distance)) {
			fstColX = collisionX;
			fstColX.pos = {
				posX: collisionX.pos.posX - innerDir.x,
			};
		}

		// collision Y
		const collisionY = collisionCheck({
			posX: from.x,
			posY: from.y,
			posZ: from.z,
			dirX: 0,
			dirY: absolute.y,
			dirZ: 0,
			boundingBox,
			access: true,
		});
		if (collisionY && (fstColY === null || collisionY.obj.distance < fstColY.obj.distance)) {
			fstColY = collisionY;
			fstColY.pos = {
				posY: collisionY.pos.posY - innerDir.y,
			};
		}

		// collision Z
		const collisionZ = collisionCheck({
			posX: from.x,
			posY: from.y,
			posZ: from.z,
			dirX: 0,
			dirY: 0,
			dirZ: absolute.z,
			boundingBox,
			access: true,
		});
		if (collisionZ && (fstColZ === null || collisionZ.obj.distance < fstColZ.obj.distance)) {
			fstColZ = collisionZ;
			fstColZ.pos = {
				posZ: collisionZ.pos.posZ - innerDir.z,
			};
		}
	});

	return [fstColX, fstColY, fstColZ];
}

export function getTargetPosition({ posX, posY, posZ, font, left, up, core }) {
	const scaleXOZ = (config.controller.cheat ? symConfig.actionsScale.cheatFactor : 1) * symConfig.actionsScale.walking * symConfig.actionsScale.moveScale * config.controller.opSens;
	const scaleOY = (config.controller.cheat ? symConfig.actionsScale.cheatFactor : 1) * symConfig.actionsScale.jump * symConfig.actionsScale.moveScale * config.controller.opSens;

	const absolute = new THREE.Vector3(-left, up, -font).applyEuler(new THREE.Euler(0, core.camera.rotation.y, 0, 'YXZ'));
	absolute.x *= scaleXOZ;
	absolute.z *= scaleXOZ;
	absolute.y *= scaleOY;

	return {
		posX: posX + absolute.x,
		posY: posY + absolute.y,
		posZ: posZ + absolute.z,
	};
}
