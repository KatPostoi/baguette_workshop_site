const http = require('http');

const port = Number(process.env.PORT ?? 3000);
const options = {
  host: 'localhost',
  port,
  path: '/health',
  timeout: 2000,
};

const request = http.get(options, (response) => {
  if (response.statusCode !== 200) {
    process.exit(1);
    return;
  }

  response.on('data', () => undefined);
  response.on('end', () => process.exit(0));
});

request.on('error', () => process.exit(1));
request.on('timeout', () => {
  request.destroy();
  process.exit(1);
});
