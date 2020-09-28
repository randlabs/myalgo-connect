const path = require("path");
const modeConfig = env => require(`./config/webpack.${env}`)(env);


module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
	return webpackMerge.merge(
		{
			mode: mode,
			entry: path.join(__dirname, "src", "index"),
			output: {
				path: path.join(__dirname, "dist"),
				publicPath: "/dist/",
				filename: "bundle.js",
				chunkFilename: "[name].js"
			},
			module: {
				rules: []
			},
			resolve: {
				extensions: [ ".json", ".js" ]
			},
		},
		modeConfig
	);
};
