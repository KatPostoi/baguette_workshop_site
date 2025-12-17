import http from 'node:http';

const port = Number(process.env.VITE_DEV_SERVER_PORT || 6314);

const options = {
  host: 'localhost',
  port,
  path: '/',
  timeout: 2000,
};

const request = http.get(options, (response) => {
  if (response.statusCode >= 200 && response.statusCode < 500) {
    process.exit(0);
  }
  process.exit(1);
});

request.on('error', () => process.exit(1));
request.on('timeout', () => {
  request.destroy();
  process.exit(1);
});
