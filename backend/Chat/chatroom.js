import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name correctly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update path to be relative to this file
const chatFilePath = path.join(__dirname, 'chatroom.json');

export async function initChatRoom() {
  try {
    await fs.access(chatFilePath);
    console.log('Chat room file found at:', chatFilePath);
  } catch {
    console.log('Creating new chat room file at:', chatFilePath);
    await fs.writeFile(chatFilePath, JSON.stringify({ messages: [], lastId: 0 }, null, 2));
  }
}

export async function getMessages(lastId = 0) {
  const data = await fs.readFile(chatFilePath, 'utf8');
  const chatData = JSON.parse(data);
  return chatData.messages.filter(msg => msg.id > lastId);
}

export async function addMessage(message, sender) {
  const data = await fs.readFile(chatFilePath, 'utf8');
  const chatData = JSON.parse(data);
  
  const newMessage = {
    id: chatData.lastId + 1,
    message,
    sender,
    timestamp: new Date().toISOString()
  };

  chatData.messages.push(newMessage);
  chatData.lastId = newMessage.id;

  await fs.writeFile(chatFilePath, JSON.stringify(chatData, null, 2));
  return newMessage;
}