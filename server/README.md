# AIFTW Poe Bot Server

This is the Poe bot server for the AIFTW platform. It uses FastAPI and the official Poe protocol.

## Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
```

2. Activate the virtual environment:
```bash
# On macOS/Linux:
source venv/bin/activate

# On Windows:
.\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Make sure your `.env` file contains your Poe API token:
```
POE_TOKEN=your_token_here
```

## Running the Server

To run the server:

```bash
python poe_bot.py
```

## Bot Settings

The bot is configured with the following settings:
- Name: AIFTW Bot
- Supports attachments
- Provides suggested replies
- Has a friendly introduction message

## Protocol Implementation

This bot implements the [Poe Protocol](https://creator.poe.com/docs/poe-protocol-specification) using the official [fastapi-poe](https://github.com/poe-platform/fastapi-poe) library.

## Development

To modify the bot's behavior, edit the `EchoBot` class in `poe_bot.py`. The main components are:

1. `get_response()`: Handles message responses
2. `get_settings()`: Configures bot settings

## Testing

You can test the bot locally by sending POST requests to the server endpoint.
