//config app for PM2
module.exports = {
	apps: [
		{
			name: "pnc-registration:4013", //label
			script: "server.js", //entrypoint
		},
	],
};
