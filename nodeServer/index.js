// Node Server which will handle socket io connections
const { Server } = require('socket.io');

const io = new Server(8000, {
    cors: {
        origin: "http://127.0.0.1:5500", 
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('new-user-joined', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
        console.log(`${name} joined the chat`);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
        console.log(`${users[socket.id]} sent a message: ${message}`);
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('left', users[socket.id]);
            console.log(`${users[socket.id]} left the chat`);
            delete users[socket.id];
        }
    });
});

console.log('Socket.IO server running on port 8000');
