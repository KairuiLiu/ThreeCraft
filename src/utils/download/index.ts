// 下载JSON文件
export function downloadJson(jsonString) {
	const tmpLink = document.createElement('a');
	const file = new File([jsonString], `mc-archive-${Date.now()}.json`, {
		type: 'application/json',
	});
	const objectUrl = URL.createObjectURL(file);
	tmpLink.href = objectUrl;
	tmpLink.download = file.name;
	document.body.appendChild(tmpLink);
	tmpLink.click();
	document.body.removeChild(tmpLink);
	URL.revokeObjectURL(objectUrl);
}
