const dom = require("belter");

const defaultOptions = {
	width: 400,
	height: 600,
};

/**
 * @description Open a new window
 * @param {string} url window url
 * @returns {Window} Returns window object
 */
function openPopup(url) {
	return dom.popup(url, defaultOptions);
}

module.exports = {
	openPopup,
};
