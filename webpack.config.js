const path = require("path");

module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
	return {
		mode: mode,
		entry: {
			"myalgo.min": path.join(__dirname, "index"),
		},
		output: {
			path: path.join(__dirname, "dist"),
			publicPath: "/dist/",
			chunkFilename: "[name].js",
			library: "MyAlgoConnect",
		},
		module: {
			rules: []
		},
		resolve: {
			extensions: [ ".json", ".js" ]
		},
	};
};
