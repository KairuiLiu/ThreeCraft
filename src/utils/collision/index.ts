// TODO: 实现碰撞检测 - 绝对方向
export function collisionCheck({ posX, posY, posZ, dirX, dirY, dirZ, core }) {
	return {
		check: false,
		mesh: {
			obj: null,
			posX: 1,
			posY: 1,
			posZ: 1,
		},
		side: {
			obj: null,
			posX: 1,
			posY: 1,
			posZ: 1,
		},
	};
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
