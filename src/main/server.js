const WebSocket = require('ws');

const messages = [];
const PORT = parseInt(process.env.PORT, 10) || 8087;
const server = new WebSocket.Server({port: PORT});

server.on('listening', () => console.log(`WebSocket server listening on port "${PORT}"...`));
server.on('message', () => console.log(`Message received: ${message}`));

server.on('connection', (ws) => {
  messages.forEach((message) => ws.send(message));

  ws.on('message', (message) => {
    messages.push(message);
    server.clients.forEach((client) => client.send(message));
  });
});
