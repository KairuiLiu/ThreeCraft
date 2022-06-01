import * as THREE from 'three';
import { generateFragSync } from '../terrain/generate/generateFragSync';
import { symConfig } from '../../controller/config';
import { getDir } from '../../utils/get-dir';

const needCheck = [
	[
		// 前
		[
			// 左
			[1, 2, 3, 4, 5, 6, 0], // 下
			[1, 2, 3, 5, 6, 0], // 不上
			[1, 2, 3, 5, 6, 7, 0], // 上
		],
		[
			// 不左
			[1, 2, 3, 4, 5, 0], // 下
			[1, 2, 3, 0], // 不上
			[1, 2, 3, 6, 7, 0], // 上
		],
		[
			// 右
			[1, 2, 3, 4, 5, 7, 0], // 下
			[1, 2, 3, 4, 7, 0], // 不上
			[1, 2, 3, 4, 6, 7, 0], // 上
		],
	],

	[
		// 不前
		[
			// 左
			[1, 2, 4, 5, 6, 0], // 下
			[1, 2, 5, 6], // 不上
			[1, 2, 3, 5, 6, 7], // 上
		],
		[
			// 不左
			[1, 4, 5, 0], // 下
			[], // 不上
			[2, 3, 6, 7], // 上
		],
		[
			// 右
			[1, 3, 4, 5, 7, 0], // 下
			[0, 3, 4, 7], // 不上
			[2, 3, 4, 6, 7, 0], // 上
		],
	],
	[
		// 后
		[
			// 左
			[1, 2, 4, 5, 6, 7, 0], // 下
			[1, 2, 4, 5, 6, 7], // 不上
			[1, 2, 3, 4, 5, 6, 7], // 上
		],
		[
			// 不左
			[1, 4, 5, 6, 7, 0], // 下
			[4, 5, 6, 7], // 不上
			[2, 3, 4, 5, 6, 7], // 上
		],
		[
			// 右
			[1, 3, 4, 5, 6, 7, 0], // 下
			[3, 4, 5, 6, 7, 0], // 不上
			[2, 3, 4, 5, 6, 7, 0], // 上
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
	const len = direction.length() + 0.3;
	direction.normalize();
	// 需不需要修改len?
	const ray = new THREE.Raycaster(originPosition, direction.clone(), 0, len);
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
	// 变换矩阵
	const revMat = new THREE.Matrix3();
	revMat.setFromMatrix4(core.camera.matrixWorld);
	// 相对运动方向(单位向量化)
	const dirU = getDir(new THREE.Vector3(-left, up, -font));
	// 绝对运动方向
	const absoluteMove = new THREE.Vector3(-left, 0, -font).applyMatrix3(revMat);
	absoluteMove.y = up;
	// 绝对运动距离
	const maxMove = Math.ceil(absoluteMove.length());
	const boundingBox = generateFragSync(posX - 3 - maxMove, posX + 3 + maxMove, posZ - 3 - maxMove, posZ + 3 + maxMove, posY - 5 - maxMove, posY + 5 + maxMove, true);
	const origin = new THREE.Vector3(posX, posY, posZ);
	let fstCol = null;
	needCheck[dirU.z + 1][dirU.x + 1][dirU.y + 1].forEach(d => {
		const innerDir = dirs[d].clone();
		// inner dir
		const from = origin.clone().add(innerDir);
		const collision = collisionCheck({
			posX: from.x,
			posY: from.y,
			posZ: from.z,
			dirX: absoluteMove.x,
			dirY: absoluteMove.y,
			dirZ: absoluteMove.z,
			boundingBox,
			access: true,
		});
		if (collision && (fstCol === null || collision.obj.distance < fstCol.obj.distance)) {
			fstCol = collision;
			const delta = new THREE.Vector3(collision.pos.posX - from.x, collision.pos.posY - from.y, collision.pos.posZ - from.z);
			const deltaU = getDir(delta.clone());
			fstCol.pos = {
				posX: delta.x + posX - deltaU.x * 0.2,
				posY: delta.y + posY - deltaU.y * 0.2,
				posZ: delta.z + posZ - deltaU.z * 0.2,
			};
		}
	});
	return fstCol;
}

export function getTargetPosition({ posX, posY, posZ, font, left, up, core }) {
	const relative = new THREE.Vector3(-left, 0, -font);
	const mat = new THREE.Matrix3();
	mat.setFromMatrix4(core.camera.matrixWorld);
	const absolute = relative.clone().applyMatrix3(mat);
	return {
		posX: posX + absolute.x,
		posY: posY + up,
		posZ: posZ + absolute.z,
	};
}
