import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { setupSocketHandlers, setIo } from './socketHandler';
import { handleTranslateRequest } from './translateHandler';

dotenv.config();

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const httpServer = createServer((req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': CLIENT_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // Translation endpoint
  if (req.method === 'POST' && req.url === '/api/translate') {
    handleTranslateRequest(req, res, CLIENT_ORIGIN);
    return;
  }

  res.writeHead(404);
  res.end();
});
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

setIo(io);

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  setupSocketHandlers(socket);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Client origin: ${CLIENT_ORIGIN}`);
});
