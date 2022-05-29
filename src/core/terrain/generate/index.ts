import { blockTypes } from '../../loader';

export function generate({ stx, sty, edx, edy }) {
	const res = new Array(blockTypes.length);
	blockTypes.forEach((d, i) => {
		const cnt = Math.floor(Math.random() * 100);
		res[i] = new Array(cnt);
		for (let j = 0; j < cnt; j += 1) {
			res[i][j] = {
				x: Math.floor(Math.random() * 300),
				y: Math.random(),
				z: Math.floor(Math.random() * 300),
			};
		}
	});
	return res;
}
