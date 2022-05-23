export default () => {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) return 'mobile';
	return 'pc';
};
