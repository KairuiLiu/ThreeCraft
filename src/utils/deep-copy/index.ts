export function deepCopy(source, target) {
	const copyedObjs = []; // 此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象
	copyedObjs.push({ fromTarget: source, toTarget: target });
	function deepCopyFunction(sourceItem, targetItem) {
		Object.keys(sourceItem).forEach(key => {
			if (typeof sourceItem[key] !== 'object') {
				targetItem[key] = sourceItem[key];
			} else {
				if (targetItem[key]) return;
				for (let i = 0; i < copyedObjs.length; i += 1) {
					if (copyedObjs[i].fromTarget === sourceItem[key]) {
						targetItem[key] = copyedObjs[i].toTarget;
						return;
					}
				}
				targetItem[key] = {};
				if (Array.isArray(sourceItem[key])) targetItem[key] = [];
				copyedObjs.push({ fromTarget: sourceItem[key], toTarget: targetItem[key] });
				deepCopyFunction(sourceItem[key], targetItem[key]);
			}
		});
	}
	return deepCopyFunction(source, target);
}
