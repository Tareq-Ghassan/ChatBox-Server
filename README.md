
# Chatbox Server

This repository contains the backend implementation for the **Chatbox** app, a chat application with features like real-time messaging, voice and video calls, sending media, and more. The backend is built using **Node.js** and handles authentication, media uploads, messaging, and API integration.

## Features

- **Authentication**: Sign-up and login functionality for users.
- **Real-time Messaging**: Enables real-time chat between contacts.
- **Voice & Video Calls**: Facilitates high-quality voice and video calls between users.
- **Media Sharing**: Supports sending images, voice notes, stickers, locations, and documents.
- **Poll Creation**: Allows users to create polls in chats.
- **Story Uploading**: Supports sharing stories that disappear after 24 hours.

## Tech Stack

- **Node.js**: The backend framework.
- **Express.js**: API routing and middleware handling.
- **Socket.io**: Real-time communication for chat and call functionalities.
- **MongoDB**: Database for storing user data, messages, and media.
- **Cloud Storage**: For media uploads (images, videos, etc.).

## Installation

To set up the server locally:

1. Clone this repository:
   ```bash
   git clone https://github.com/Tareq-Ghassan/chatbox-server.git
   ```

2. Navigate to the project directory:
   ```bash
   cd chatbox-server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create an `.env` file in the root of the project and add your environment variables (e.g., database credentials, API keys, etc.):
   ```bash
   touch .env
   ```

   Example `.env` file:
   ```bash
   APP_PORT=8080
   DB_URL=mongodb://localhost:27017/chatbox
   JWT_SECRET=your_jwt_secret
   ```

5. Start the server:
   ```bash
   npm start
   ```

6. The server should now be running on `http://localhost:8080`.
  

## WebSocket (Real-time Communication)

The server uses **Socket.io** for real-time messaging and calls. The Socket.io server listens for specific events like `message`, `call`, and `disconnect` to handle real-time interactions between users.

## License

This project is licensed under MIT, and contributions are welcome. Feel free to fork the repository and submit pull requests for improvements or new features.

## Frontend

The frontend (Flutter app) for this server is located here: [Chatbox App](https://github.com/Tareq-Ghassan/chatbox).
