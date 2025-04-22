import express from 'express';
import { initChatRoom, getMessages, addMessage } from '../Chat/chatroom.js';

const router = express.Router();

// Initialize chat room
await initChatRoom();

// Debug logging
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// GET /api/chat/messages
router.get('/messages', async (req, res) => {
  try {
    const { lastId = 0 } = req.query;
    const messages = await getMessages(parseInt(lastId));
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, error: 'Could not fetch messages' });
  }
});

// POST /api/chat/messages
router.post('/messages', async (req, res) => {
  try {
    console.log('Received message:', req.body); // Debug log
    const { message, sender } = req.body;
    const newMessage = await addMessage(message, sender);
    res.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: 'Could not send message' });
  }
});

export default router;