const dom = require("belter");

const defaultValues = {
	width: 500,
	height: 590,
};

/**
 * @description Open a new window
 * @param {string} url window url
 * @returns {Window} Returns window object
 */
function openPopup(url) {
	return dom.popup(url, defaultValues);
}


module.exports = {
	openPopup,
};
