# Real-Time Chat Platform

The Real-Time Chat Platform is a modern messaging application designed for seamless communication. Built using React, Node.js, Express, and Socket.io, it ensures real-time messaging with secure authentication and efficient state management.

<!--   ## Demo -->
<!-- [chatapp.example.com](https://chatapp.example.com) -->

## Features

- **Real-Time Messaging**  
   - Instant chat updates using Socket.io
   - One-on-one and group chat support  
- **User Authentication**  
   - Secure login/signup with JWT authentication  
   - Profile management  
- **File Sharing**  
   - Upload and send images and files using Multer  
   - Secure cloud storage integration  
- **Notifications**  
   - Real-time message notifications  
   - Read receipts and typing indicators  
- **Admin Panel**  
   - User management and moderation  
   - Conversation history tracking  

## Authors

- [udham8306](https://github.com/udham8306)

## Tech Stack

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.io](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT (JSON Web Token)](https://jwt.io/)
- [Axios](https://axios-http.com/docs/intro)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Multer](https://www.npmjs.com/package/multer)

## Environment Setup

- Download and install the latest Node.js and npm from [Node.js](https://nodejs.org/en/download/)

## Installation & Setup

Clone the project:

```bash
  git clone https://github.com/udham8306/Real-Time-Chat-Platform.git
```

Go to the project directory:

```bash
  cd Real-Time-Chat-Platform
```

### Setting Up Backend

Navigate to the backend folder:
```bash
    cd backend
```

Install dependencies:
```bash
    npm install
```

Create a `.env` file and add the required environment variables:
```bash
    MONGODB_URI='your-mongodb-uri'
    JWT_SECRET='your-secret-key'
    CLOUDINARY_NAME='your-cloudinary-name'
    CLOUDINARY_API_KEY='your-api-key'
    CLOUDINARY_SECRET_KEY='your-secret-key'
    SOCKET_PORT=5000
```

Start the backend server:
```bash
    npm run dev
```

### Setting Up Frontend

Navigate to the frontend folder:
```bash
    cd frontend
```

Install dependencies:
```bash
    npm install
```

Create a `.env` file and add the frontend environment variables:
```bash
    VITE_BACKEND_URL='http://localhost:5000'
    VITE_SOCKET_URL='http://localhost:5000'
```

Start the frontend server:
```bash
    npm run dev
```

## Screenshots

### Login Page  
![Login Page](https://github.com/udham8306/Real-Time-Chat-Platform/issues/1#issue-1234567890)

### Chat Interface  
![Chat Interface](https://github.com/udham8306/Real-Time-Chat-Platform/issues/2#issue-1234567890)

## Links for Technology Installation/Documentation:

- **[MongoDB](https://www.mongodb.com/)**: NoSQL database setup and documentation.
- **[Socket.io](https://socket.io/docs/)**: WebSockets for real-time communication.
- **[JWT](https://jwt.io/introduction/)**: Secure user authentication.
- **[Multer](https://www.npmjs.com/package/multer)**: File uploads.
- **[Axios](https://axios-http.com/docs/intro)**: HTTP client for API requests.

## Contributing

Contributions are welcome! If you’d like to contribute, please create a pull request with your suggested improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

