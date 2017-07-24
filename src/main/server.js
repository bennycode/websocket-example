const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const PUBLIC_DIR = path.join(__dirname, 'public');
let isLocked = false;

const cache = {};

const app = express();
app.use(express.static(PUBLIC_DIR));

const resource = '/fail';
app.get(resource, (request, response) => {
  const parameter = 'on';
  const value = parseInt(request.query[parameter], 10);
  const key = `${resource}?${parameter}=${value}`;

  if (cache[key] === 0) {
    delete cache[key];
    return response.sendStatus(404);
  }

  if (!cache[key]) {
    cache[key] = value;
  }

  if (cache[key] > 0) {
    cache[key] -= 1;
    return response.json({remaining: cache[key]});
  }

  response.sendStatus(500);
});

app.get('/check-lock', (request, response) => {
  if (isLocked) {
    return response.sendStatus(400)
  } else {
    return response.sendStatus(200);
  }
});

app.get('/set-lock', function(request, response) {
  isLocked = (request.query.value === 'true');
  return response.json({currentValue: isLocked});
});

const httpServer = http.createServer(app);

const wsServer = new WebSocket.Server({server: httpServer});
wsServer.on('listening', () => console.log(`WebSocket server listening on port "${PORT}"...`));
wsServer.on('message', () => console.log(`Message received: ${message}`));
wsServer.on('connection', (ws) => {
  ws.on('message', (message) => wsServer.clients.forEach((client) => client.send(`Someone sent: ${message}`)));
});

httpServer.listen(PORT, () => {
  console.log(`HTTP server listening on port "${httpServer.address().port}"...`);
});
