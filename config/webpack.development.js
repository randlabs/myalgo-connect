module.exports = env => ({
	plugins: [
	],
	devtool: "source-map",
	// devtool: "inline-source-map",
	devServer: {
		contentBase: "./dist",
		disableHostCheck: true,
		host: "127.0.0.1",
		port: 7001,
		https: true
	},
});
