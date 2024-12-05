import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { logger } from '../lib/logger';
import { PoeError, ValidationError } from '../lib/error';
import { validateChatMessage, validateBotConfig, BotConfig } from '../lib/validations/chatbot';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['POE_TOKEN', 'FRONTEND_URL', 'POE_BOT_URL'] as const;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const server = fastify({
  logger: true,
});

// Configure CORS
server.register(cors, {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Error handler
server.setErrorHandler((error, request, reply) => {
  if (error instanceof ValidationError) {
    return reply.status(400).send({
      error: error.message,
      code: error.code,
      details: error.details,
    });
  }

  if (error instanceof PoeError) {
    return reply.status(error.statusCode).send({
      error: error.message,
      code: error.code,
      details: error.details,
    });
  }

  logger.error('Unhandled error', { error });
  return reply.status(500).send({
    error: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  });
});

// Routes
server.post('/api/chat', async (request, reply) => {
  try {
    const validatedData = validateChatMessage(request.body);
    // TO DO: implement API call to FastAPI POE
    logger.info('Chat message processed', { botName: validatedData.botName });
    return reply.send({ response: {} });
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    logger.error('Failed to process chat message', { error });
    throw new PoeError('Failed to process chat message', 'CHAT_ERROR', 500, error);
  }
});

server.get('/api/bots', async (request, reply) => {
  try {
    // TO DO: implement API call to FastAPI POE
    const bots: BotConfig[] = [] as BotConfig[];
    logger.info('Retrieved bot list', { count: bots.length });
    return reply.send({ bots });
  } catch (error) {
    logger.error('Failed to retrieve bots', { error });
    throw new PoeError('Failed to retrieve bots', 'BOT_LIST_ERROR', 500, error);
  }
});

server.post('/api/create-bot', async (request, reply) => {
  try {
    const validatedData = validateBotConfig(request.body);
    // TO DO: implement API call to FastAPI POE
    const bot: BotConfig = {
      ...validatedData,
      settings: {
        enable_multi_bot_chat_prompting: true,
        enforce_author_role_alternation: false,
        allow_attachments: true,
        expand_text_attachments: true,
        enable_image_comprehension: true,
        ...validatedData.settings // Allow overriding defaults if provided
      }
    };
    logger.info('Bot created', { 
      botName: validatedData.name,
      settings: bot.settings 
    });
    return reply.send({ bot });
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    logger.error('Failed to create bot', { error });
    throw new PoeError('Failed to create bot', 'BOT_CREATION_ERROR', 500, error);
  }
});

server.delete('/api/delete-bot/:botName', async (request, reply) => {
  try {
    const { botName } = request.params as { botName: string };
    // TO DO: implement API call to FastAPI POE
    logger.info('Bot deleted', { botName });
    return reply.send({ success: true });
  } catch (error) {
    logger.error('Failed to delete bot', { error });
    throw new PoeError('Failed to delete bot', 'BOT_DELETION_ERROR', 500, error);
  }
});

// Start server
async function start() {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    await server.listen({ port, host: '0.0.0.0' });
    logger.info('Server started', { port });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

start();
