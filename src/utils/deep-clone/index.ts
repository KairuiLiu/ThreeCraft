// 深克隆
// reference from https://juejin.cn/post/6844903620190666759
export function deepClone(source) {
	const copyedObjs = []; // 此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象
	function deepCopyFunction(target) {
		if (typeof target !== 'object' || !target) {
			return target;
		}
		for (let i = 0; i < copyedObjs.length; i += 1) {
			if (copyedObjs[i].target === target) {
				return copyedObjs[i].copyTarget;
			}
		}
		let obj = {};
		if (Array.isArray(target)) {
			obj = []; // 处理target是数组的情况
		}
		copyedObjs.push({ target, copyTarget: obj });
		Object.keys(target).forEach(key => {
			if (obj[key]) {
				return;
			}
			obj[key] = deepCopyFunction(target[key]);
		});
		return obj;
	}
	return deepCopyFunction(source);
}
