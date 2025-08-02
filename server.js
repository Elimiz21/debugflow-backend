import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/v1/docs', (req, res) => {
  res.json({
    message: 'DebugFlow API Documentation',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/api/v1/docs'
    }
  });
});

app.get('/api/v1/status', (req, res) => {
  res.json({
    message: 'DebugFlow Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  
  socket.on('join-project', (projectId) => {
    socket.join(`project-${projectId}`);
    console.log(`📁 Client ${socket.id} joined project ${projectId}`);
  });

  socket.on('analyze-code', (data) => {
    console.log('🔍 Code analysis request received:', data);
    
    // Simulate analysis processing
    setTimeout(() => {
      socket.emit('analysis-complete', {
        analysisId: data.analysisId,
        results: {
          status: 'completed',
          issues: [
            {
              type: 'warning',
              line: 2,
              message: 'Consider using const instead of let for variables that are not reassigned'
            },
            {
              type: 'info', 
              line: 1,
              message: 'Function looks good! No major issues found.'
            }
          ],
          suggestions: [
            'Add error handling for edge cases',
            'Consider adding JSDoc comments for better documentation'
          ]
        }
      });
    }, 2000);
  });
  
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log('\n🚀 DebugFlow Backend Server Started!');
  console.log('================================');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`📚 Docs: http://localhost:${PORT}/api/v1/docs`);
  console.log('================================\n');
});

export default app;
