module.exports = {
  apps: [
    {
      name: 'Pledge4Earth',
      script: 'app.js', // e.g., app.js or server.js
      instances: '1',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
	MONGODB_URI:'mongodb+srv://kchirag:Belapur-123@pledge4earth.8he3kvu.mongodb.net/?retryWrites=true&w=majority',
	PORT:'443',
	SSLENABLED:'false',
	PRIVATE_KEY:'/usr/local/ssl/pledge4earth.org.key',
	CERTIFICATE:'/usr/local/ssl/pledge4earth_org.crt',
	CERTIFICATECA:'/usr/local/ssl/pledge4earth_org.ca-bundle',
	      
      },
    },
  ],
};
