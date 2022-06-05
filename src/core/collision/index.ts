import * as THREE from 'three';
import { generateFragSync } from '../terrain/generate/generateFragSync';
import { symConfig, config } from '../../controller/config';
import { getDir } from '../../utils/get-dir';

// 指定当向某个方向运动时需要检查那几个块是否会碰撞, 点定义如下
//   7_____________6
//   /| width=0.8 /|
//  /_|__________/ |height=2
// 3| |         2| |
//  | | *    *   | |
//  | |   /  |   | |
//  | |      |   | |
//  | |  1.75|   | |
//  |4|______|___|_|5
//  |/_______|___|/length=0.5
//  0            1
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

// 指定这几个检测点距离相机的位置
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
 * 给定原点和方向, 判断是否会碰撞
 * @param posX/Y/Z: 发射点x/y/z
 * @param dirX/Y/Z: 绝对方向x/y/z
 * @param boundingBox: 附近地形(包围盒)
 * @returns null: 没有碰撞
 * @returns {obj: 碰撞物体, pos: 碰撞点}
 */
export function collisionCheck({ posX, posY, posZ, dirX, dirY, dirZ, boundingBox, access, log }) {
	const originPosition = new THREE.Vector3(posX, posY, posZ);
	const direction = new THREE.Vector3(dirX, dirY, dirZ);
	const len = direction.length();
	const ray = new THREE.Raycaster(originPosition, direction.clone().normalize(), 0, len + 0.1);

	// 如果没有包围盒就现生成一个
	if (!boundingBox)
		boundingBox = generateFragSync(
			posX - 3 - Math.ceil(len),
			posX + 3 + Math.ceil(len),
			posZ - 3 - Math.ceil(len),
			posZ + 3 + Math.ceil(len),
			posY - 3 - Math.ceil(len),
			posY + 3 + Math.ceil(len),
			access,
			log
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

// 判断用户点击操作是否发生碰撞
export function relativeOperateCollisionCheck({ posX, posY, posZ, font, left, up, core, log, access }) {
	const eulerRotate = new THREE.Euler(core.camera.rotation.x, core.camera.rotation.y, 0, 'YXZ');
	const absolute = new THREE.Vector3(-left, up, -font).applyEuler(eulerRotate);
	const absoluteU = getDir(absolute);
	const len = absolute.length();

	const boundingBox = generateFragSync(
		posX - (absoluteU.x < 0 ? Math.ceil(len) : 3),
		posX + (absoluteU.x > 0 ? Math.ceil(len) : 3),
		posZ - (absoluteU.z < 0 ? Math.ceil(len) : 3),
		posZ + (absoluteU.z > 0 ? Math.ceil(len) : 3),
		posY - (absoluteU.y < 0 ? Math.ceil(len) : 3),
		posY + (absoluteU.y > 0 ? Math.ceil(len) : 3),
		access,
		log
	);

	const collision = collisionCheck({
		posX,
		posY,
		posZ,
		dirX: absolute.x,
		dirY: absolute.y,
		dirZ: absolute.z,
		boundingBox,
		access,
		log,
	});
	if (collision) {
		collision.pos.posX = collision.obj.point.x - collision.obj.face.normal.x * 0.5;
		collision.pos.posY = collision.obj.point.y - collision.obj.face.normal.y * 0.5;
		collision.pos.posZ = collision.obj.point.z - collision.obj.face.normal.z * 0.5;
	}

	boundingBox.group.children.forEach(d => d?.dispose());

	return collision;
}

/**
 * 给出相机位置, 与相对位移, 检查每一个检查点的碰撞情况
 * @param posX/Y/Z: 相机位置
 * @param font/left/up: 相对方向x/y/z
 * @param Core: 场景
 * @returns null: 没有碰撞
 * @returns {obj: 碰撞物体, pos: 发生碰撞时相机位置}
 */
export function relativeCollisionCheckAll({ posX, posY, posZ, font, left, up, core, log }) {
	// 将相对运动方向三值化? (x/y/z = -1/0/1)
	const dirU = getDir(new THREE.Vector3(-left, up, -font));
	// 相机位置与需要转过的欧拉角
	const origin = new THREE.Vector3(posX, posY, posZ);
	const eulerRotate = new THREE.Euler(0, core.camera.rotation.y, 0, 'YXZ');
	// 计算在水平与垂直方向速度
	const scaleXOZ = symConfig.actionsScale.walking * symConfig.actionsScale.moveScale * config.controller.opSens;
	const scaleOY = symConfig.actionsScale.jump * symConfig.actionsScale.moveScale * config.controller.opSens;
	// 计算绝对移动方向与速度
	const absolute = new THREE.Vector3(-left, up, -font).applyEuler(eulerRotate);
	absolute.x *= scaleXOZ;
	absolute.z *= scaleXOZ;
	absolute.y *= scaleOY;
	// 计算最大移动距离, 生成包围盒
	const maxMove = Math.ceil(absolute.length());
	const boundingBox = generateFragSync(posX - 3 - maxMove, posX + 3 + maxMove, posZ - 3 - maxMove, posZ + 3 + maxMove, posY - 5 - maxMove, posY + 5 + maxMove, true, log);
	// 记录在不同方向上运动时最先碰到的物体
	let fstColX = null;
	let fstColY = null;
	let fstColZ = null;
	// 检测每一个检查点
	needCheck[dirU.z + 1][dirU.x + 1][dirU.y + 1].forEach(d => {
		// 起始点 = 相机位置 + 相机到检查点向量
		const innerDir = dirs[d].clone().applyEuler(eulerRotate);
		const from = origin.clone().add(innerDir);

		const collisionX = collisionCheck({
			posX: from.x,
			posY: from.y,
			posZ: from.z,
			dirX: absolute.x,
			dirY: 0,
			dirZ: 0,
			boundingBox,
			access: true,
			log,
		});
		if (collisionX && (fstColX === null || collisionX.obj.distance < fstColX.obj.distance)) {
			fstColX = collisionX;
			fstColX.pos = {
				posX: collisionX.pos.posX - innerDir.x,
			};
		}

		const collisionY = collisionCheck({
			posX: from.x,
			posY: from.y,
			posZ: from.z,
			dirX: 0,
			dirY: absolute.y,
			dirZ: 0,
			boundingBox,
			access: true,
			log,
		});
		if (collisionY && (fstColY === null || collisionY.obj.distance < fstColY.obj.distance)) {
			fstColY = collisionY;
			fstColY.pos = {
				posY: collisionY.pos.posY - innerDir.y,
			};
		}

		const collisionZ = collisionCheck({
			posX: from.x,
			posY: from.y,
			posZ: from.z,
			dirX: 0,
			dirY: 0,
			dirZ: absolute.z,
			boundingBox,
			access: true,
			log,
		});
		if (collisionZ && (fstColZ === null || collisionZ.obj.distance < fstColZ.obj.distance)) {
			fstColZ = collisionZ;
			fstColZ.pos = {
				posZ: collisionZ.pos.posZ - innerDir.z,
			};
		}
	});

	boundingBox.group.children.forEach(d => d?.dispose());

	return [fstColX, fstColY, fstColZ];
}

// 获取理想的运动位置
export function getTargetPosition({ posX, posY, posZ, font, left, up, core }) {
	// 水平与垂直的速度
	const scaleXOZ = (config.controller.cheat ? symConfig.actionsScale.cheatFactor : 1) * symConfig.actionsScale.walking * symConfig.actionsScale.moveScale * config.controller.opSens;
	const scaleOY = (config.controller.cheat ? symConfig.actionsScale.cheatFactor : 1) * symConfig.actionsScale.jump * symConfig.actionsScale.moveScale * config.controller.opSens;
	// 绝对移动方向
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
