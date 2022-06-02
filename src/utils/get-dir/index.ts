// 三值化？ -1, 0, 1
export function getDir(o) {
	const v = o.clone();
	if (v.x > 0) v.x = 1;
	else if (v.x < 0) v.x = -1;
	if (v.y > 0) v.y = 1;
	else if (v.y < 0) v.y = -1;
	if (v.z > 0) v.z = 1;
	else if (v.z < 0) v.z = -1;
	return v;
}
