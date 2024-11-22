import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useParams: () => ({
    botId: 'test-bot-id',
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));