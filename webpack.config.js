const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const modeConfig = env => require(`./config/webpack.${env}`)(env);


module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
	let url = "https://dev.wallet.myalgo.com";
	if (mode === "production")
		url = "https://wallet.myalgo.com";
	return webpackMerge.merge(
		{
			mode: mode,
			entry: path.join(__dirname, "index"),
			output: {
				path: path.join(__dirname, "dist"),
				publicPath: "/dist/",
				filename: "myalgo.js",
				chunkFilename: "[name].js",
				library: "MyAlgo",
			},
			module: {
				rules: []
			},
			resolve: {
				extensions: [ ".json", ".js" ]
			},
			plugins: [
				new webpack.DefinePlugin({
					MODE: JSON.stringify(mode),
					FRAME_URL: JSON.stringify(url),
				}),
			]
		},
		modeConfig
	);
};
