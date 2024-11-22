import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useChat } from '@/hooks/use-chat';
import ChatPage from '@/app/chat/[botId]/page';

// Mock the useChat hook
jest.mock('@/hooks/use-chat');

describe('ChatPage', () => {
  const mockSendMessage = jest.fn();
  const mockResetChat = jest.fn();

  beforeEach(() => {
    (useChat as jest.Mock).mockReturnValue({
      messages: [
        {
          id: '1',
          content: 'Hello',
          role: 'user',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          content: 'Hi there!',
          role: 'assistant',
          timestamp: new Date().toISOString(),
        },
      ],
      isLoading: false,
      error: null,
      sendMessage: mockSendMessage,
      resetChat: mockResetChat,
    });
  });

  it('renders chat messages', () => {
    render(<ChatPage />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('sends a message when form is submitted', async () => {
    render(<ChatPage />);
    const input = screen.getByPlaceholderText('Type your message...');
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('Test message');
    });
  });

  it('shows loading state', () => {
    (useChat as jest.Mock).mockReturnValue({
      messages: [],
      isLoading: true,
      error: null,
      sendMessage: mockSendMessage,
      resetChat: mockResetChat,
    });

    render(<ChatPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message', () => {
    (useChat as jest.Mock).mockReturnValue({
      messages: [],
      isLoading: false,
      error: new Error('Test error'),
      sendMessage: mockSendMessage,
      resetChat: mockResetChat,
    });

    render(<ChatPage />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
});