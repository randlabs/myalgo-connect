function sleep(msec = 200) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, msec);
	});
}

module.exports = {
	sleep,
};
