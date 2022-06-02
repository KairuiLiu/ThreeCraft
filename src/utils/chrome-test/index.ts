// 判断是不是90版本以上的Chrome / 支不支持API
export function chromeTest() {
	const chromeVersion = navigator.userAgent.toLowerCase().match(/chrome\/([0-9]+)/);
	if (chromeVersion === null || Number.parseInt(chromeVersion[1], 10) < 90) return false;
	if (!document.body?.requestFullscreen) return false;
	if (!document?.exitPointerLock) return false;
	return true;
}
