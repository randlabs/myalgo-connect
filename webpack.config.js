const path = require("path");
const webpack = require("webpack");


module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
	return {
		mode: mode,
		entry: {
			myalgo: path.join(__dirname, "index"),
		},
		output: {
			path: path.join(__dirname, "dist"),
			publicPath: "/dist/",
			chunkFilename: "[name].js",
			library: "MyAlgo",
		},
		module: {
			rules: []
		},
		resolve: {
			extensions: [ ".json", ".js" ]
		},
	};
};
