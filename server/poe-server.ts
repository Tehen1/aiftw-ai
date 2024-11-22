import fastify from 'fastify';
import cors from '@fastify/cors';
import { PoeAPI } from 'poe-api';
import dotenv from 'dotenv';

dotenv.config();

const server = fastify();
const poe = new PoeAPI();

// Configure CORS
server.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Initialize Poe client
async function initializePoe() {
  try {
    await poe.initialize(process.env.POE_TOKEN as string);
    console.log('Poe client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Poe client:', error);
    process.exit(1);
  }
}

// Routes
server.post('/api/chat', async (request, reply) => {
  try {
    const { message, botName } = request.body as { message: string; botName: string };
    
    const chat = await poe.sendMessage(botName, message);
    return { success: true, response: chat };
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return reply.status(500).send({ 
      success: false, 
      error: 'Failed to get response from bot' 
    });
  }
});

server.get('/api/bots', async (request, reply) => {
  try {
    const bots = await poe.getBots();
    return { success: true, bots };
  } catch (error) {
    console.error('Error fetching bots:', error);
    return reply.status(500).send({ 
      success: false, 
      error: 'Failed to fetch bots' 
    });
  }
});

server.post('/api/create-bot', async (request, reply) => {
  try {
    const { name, prompt } = request.body as { name: string; prompt: string };
    
    const bot = await poe.createBot(name, prompt);
    return { success: true, bot };
  } catch (error) {
    console.error('Error creating bot:', error);
    return reply.status(500).send({ 
      success: false, 
      error: 'Failed to create bot' 
    });
  }
});

server.delete('/api/delete-bot/:botName', async (request, reply) => {
  try {
    const { botName } = request.params as { botName: string };
    
    await poe.deleteBot(botName);
    return { success: true };
  } catch (error) {
    console.error('Error deleting bot:', error);
    return reply.status(500).send({ 
      success: false, 
      error: 'Failed to delete bot' 
    });
  }
});

// Start server
const start = async () => {
  try {
    await initializePoe();
    await server.listen({ 
      port: parseInt(process.env.POE_SERVER_PORT || '3001'), 
      host: '0.0.0.0' 
    });
    console.log('Server running on port 3001');
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
