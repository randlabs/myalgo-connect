function sleep(msec = 200) {
	return new Promise(resolve => setTimeout(resolve, msec));
}

module.exports = {
	sleep,
};
