let io

module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer, {
            cors: { origin: "*" }
        });

        io.on("connection", (socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on("message:new", (data) => {
                io.to(data.chatId).emit("message:new", data);
            });

            socket.on("message:edited", (data) => {
                io.to(data.chatId).emit("message:edited", data);
            });

            socket.on("message:deleted", (data) => {
                io.to(data.chatId).emit("message:deleted", data);
            });

            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.id}`);
            });
        });

        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};
