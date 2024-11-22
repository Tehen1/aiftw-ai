# Project 16

A Next.js application with real-time chat capabilities, analytics, and user management.

## Features

- Real-time chat functionality
- User authentication
- Analytics dashboard
- Bot integration
- Redis-based rate limiting
- TypeScript support
- Tailwind CSS styling

## Prerequisites

- Node.js 16+
- Redis server
- SSL certificates (for production)

## Installation

1. Clone the repository
```bash
git clone [your-repository-url]
cd project-16
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. Run development server
```bash
npm run dev
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run test` - Run tests
- `npm run lint` - Run linter

## Deployment

Use the provided deployment scripts:
- `deploy.sh` - Main deployment script
- `deploy-node.sh` - Node.js deployment
- `setup-ssl.sh` - SSL certificate setup

## Project Structure

- `/app` - Next.js application routes
- `/components` - React components
- `/lib` - Core functionality
- `/config` - Configuration files
- `/types` - TypeScript type definitions
- `/styles` - CSS and styling
- `/scripts` - Utility scripts
- `/server` - Server-side code

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Your chosen license]
