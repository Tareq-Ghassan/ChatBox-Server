require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const mongoose = require('mongoose');
const swaggerSetup = require('./swagger_config')

const initRoutes = require('./init/router/init_router')
const userRoutes = require('./auth/router/user_router')
const storyRoutes = require('./stories/router/story_router')
const chatRoutes = require('./chat/router/chat_router')

const errorController = require('./error/controller/error_controller');

app.use(bodyParser.json())
app.use('/init', initRoutes)
app.use('/user', userRoutes)
app.use('/story', storyRoutes)
app.use('/chat', chatRoutes)

swaggerSetup(app);

app.use(errorController.handle405);

app.use(errorController.handle404);



// **Async Function for Server Initialization**
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");

        const server = app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

        // Initialize Socket.IO
        const io = require('./socket').init(server);
        io.on('connection', (socket) => {
            console.log(`Client connected: ${socket.id}`);

            socket.on('disconnect', () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });

    } catch (error) {
        console.error("Error starting server:", error);
        app.use((req, res, next) => {
            next(error);
        });
    }
};

//! Start Server
startServer();


app.use(errorController.handle500);