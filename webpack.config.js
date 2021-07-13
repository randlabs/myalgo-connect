const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => {
	const mode = argv.mode ? argv.mode : "production";
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
		plugins: [
			new webpack.ProvidePlugin({
				process: "process/browser",
				Buffer: [ "buffer", "Buffer" ],
			}),
		]
	};
};
