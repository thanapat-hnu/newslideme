import express from 'express';
import cors from 'cors';
import chatRoutes from './All-Routes/chatroute.js';

const app = express();

// Add more detailed logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Chat endpoint available at http://localhost:${PORT}/api/chat/messages`);
});