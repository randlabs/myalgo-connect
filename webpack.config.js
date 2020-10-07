const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const modeConfig = env => require(`./config/webpack.${env}`)(env);


module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
	let url = "https://wallet.mxmauro.duckdns.org:8443/bridge";
	// let url = "https://wallet.localhost.com:3000";
	if (mode === "production")
		url = "https://wallet.myalgo.com";
	return webpackMerge.merge(
		{
			mode: mode,
			entry: {
				myalgo: path.join(__dirname, "index"),
				...(mode === "development" && { test: './test/test.js' })
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
			plugins: [
				new webpack.DefinePlugin({
					MODE: JSON.stringify(mode),
					FRAME_URL: JSON.stringify(url),
				}),
			]
		},
		modeConfig(mode)
	);
};
