const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = env => ({
	plugins: [
	],
	devtool: "source-map",
	// devtool: "inline-source-map",
	devServer: {
		contentBase: path.join(__dirname, "..", "dist"),
		disableHostCheck: true,
		host: "127.0.0.1",
		port: 5000,
		https: true
	},
	plugins: [
		new HtmlWebPackPlugin({
			path: path.join(__dirname, "..", "dist"),
		})
	]
});
