import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import path from "path";
import Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";
import pino from "pino";
import { SocketEvent } from "./types/socket";

dotenv.config();

const logger = pino({
    transport: {
        target: "pino-pretty",
        options: { colorize: true },
    },
});

const allowedOrigins = [
    'http://localhost:5173',
    'https://pair-fusion.vercel.app'
];

interface CorsOptions {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
    credentials: boolean;
}

const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
};

// const corsOptions = { origin: '*' };

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "public")));
const server = http.createServer(app);

const redisConnection = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const pubClient = new Redis(redisConnection);
const subClient = pubClient.duplicate();

pubClient.on('connect', () => logger.info('Redis PubClient connected.'));
pubClient.on('error', (err) => logger.error(err, 'Redis PubClient Error'));
subClient.on('error', (err) => logger.error(err, 'Redis SubClient Error'));

const io = new Server(server, {
    cors: { origin: "*" },
    adapter: createAdapter(pubClient, subClient),
    maxHttpBufferSize: 1e8,
    pingTimeout: 60000,
});

const getRoomIdFromSocket = async (socket: Socket): Promise<string | null> => {
    return await pubClient.hget(`user:${socket.id}`, 'roomId');
}

const storeFileStructure = async (roomId: string, fileStructure: any, openFiles: any[], activeFile: any) => {
    await pubClient.hset(`room:${roomId}:state`, {
        fileStructure: JSON.stringify(fileStructure),
        openFiles: JSON.stringify(openFiles),
        activeFile: JSON.stringify(activeFile),
    });
};

io.on("connection", (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // JOIN / DISCONNECT LOGIC
    socket.on(SocketEvent.JOIN_REQUEST, async ({ roomId, username }: { roomId: string, username: string }) => {
        try {
            const usersInRoom = await pubClient.smembers(`room:${roomId}:users`);
            const usernames = await Promise.all(
                usersInRoom.map(socketId => pubClient.hget(`user:${socketId}`, 'username'))
            );

            if (usernames.includes(username)) {
                socket.emit(SocketEvent.USERNAME_EXISTS);
                return;
            }
            
            socket.join(roomId);

            const user = { username, roomId, socketId: socket.id, status: 'online' };
            await pubClient.hmset(`user:${socket.id}`, { username, roomId });
            await pubClient.sadd(`room:${roomId}:users`, socket.id);
            
            const allUserSocketIds = await pubClient.smembers(`room:${roomId}:users`);
            const allUsers = await Promise.all(allUserSocketIds.map(async (sid) => {
                const name = await pubClient.hget(`user:${sid}`, 'username');
                return { username: name, socketId: sid, status: 'online' };
            }));

            socket.broadcast.to(roomId).emit(SocketEvent.USER_JOINED, { user });
            socket.emit(SocketEvent.JOIN_ACCEPTED, { user, users: allUsers });
            logger.info({ user, roomId }, "User joined room");
        } catch(e) {
            logger.error(e, 'Error during JOIN_REQUEST');
        }
    });

    socket.on("disconnecting", async () => {
        for (const roomId of socket.rooms) {
            if (roomId !== socket.id) {
                try {
                    const username = await pubClient.hget(`user:${socket.id}`, 'username');
                    if (username) {
                        io.to(roomId).emit(SocketEvent.USER_DISCONNECTED, { user: { username, socketId: socket.id } });
                        logger.info({ username, socketId: socket.id, roomId }, "User disconnected");
                    }
                    await pubClient.del(`user:${socket.id}`);
                    await pubClient.srem(`room:${roomId}:users`, socket.id);
                } catch(e) {
                    logger.error(e, "Error during disconnection");
                }
            }
        }
    });

    socket.on("REQUEST_STATE_SYNC", async ({ socketIdToSync }) => {
    const roomId = await getRoomIdFromSocket(socket);
    if (roomId) {
        // Ask another client in the room to provide the state
        socket.volatile.broadcast.to(roomId).emit("REQUEST_STATE_SYNC", { socketIdToSync });
    }
});

socket.on("STATE_SYNC", ({ socketIdToSync, fileState }) => {
    // Forward the state to the specific client that requested it
    io.to(socketIdToSync).emit("STATE_SYNC", fileState);
});
    
    // HELPER FOR BROADCASTING
    const broadcastToRoom = async (event: SocketEvent, payload: any) => {
        const roomId = await getRoomIdFromSocket(socket);
        if (roomId) {
            socket.broadcast.to(roomId).emit(event, payload);
        }
    };
    
    // EVENT HANDLING
    
    // Initial Sync
    socket.on(SocketEvent.SYNC_FILE_STRUCTURE, ({ socketId, ...payload }: { socketId: string, [key: string]: any }) => {
        io.to(socketId).emit(SocketEvent.SYNC_FILE_STRUCTURE, payload);
    });
    
    // Chat
    socket.on(SocketEvent.SEND_MESSAGE, ({ message }) => broadcastToRoom(SocketEvent.RECEIVE_MESSAGE, { message }));

    // User Status
    socket.on(SocketEvent.USER_OFFLINE, (payload) => broadcastToRoom(SocketEvent.USER_OFFLINE, payload));
    socket.on(SocketEvent.USER_ONLINE, (payload) => broadcastToRoom(SocketEvent.USER_ONLINE, payload));

    // Typing Events
    socket.on(SocketEvent.TYPING_START, async ({ cursorPosition }: { cursorPosition: number }) => {
        const roomId = await getRoomIdFromSocket(socket);
        const username = await pubClient.hget(`user:${socket.id}`, 'username');
        if (roomId && username) {
            const userPayload = { username, roomId, socketId: socket.id, typing: true, cursorPosition };
            broadcastToRoom(SocketEvent.TYPING_START, { user: userPayload });
        }
    });
    socket.on(SocketEvent.TYPING_PAUSE, async () => {
        const roomId = await getRoomIdFromSocket(socket);
        const username = await pubClient.hget(`user:${socket.id}`, 'username');
        if (roomId && username) {
            const userPayload = { username, roomId, socketId: socket.id, typing: false };
            broadcastToRoom(SocketEvent.TYPING_PAUSE, { user: userPayload });
        }
    });

    // File and Directory Events
    socket.on(SocketEvent.FILE_CREATED, (payload) => broadcastToRoom(SocketEvent.FILE_CREATED, payload));
    socket.on(SocketEvent.FILE_UPDATED, (payload) => broadcastToRoom(SocketEvent.FILE_UPDATED, payload));
    socket.on(SocketEvent.FILE_RENAMED, (payload) => broadcastToRoom(SocketEvent.FILE_RENAMED, payload));
    socket.on(SocketEvent.FILE_DELETED, (payload) => broadcastToRoom(SocketEvent.FILE_DELETED, payload));
    socket.on(SocketEvent.DIRECTORY_CREATED, (payload) => broadcastToRoom(SocketEvent.DIRECTORY_CREATED, payload));
    socket.on(SocketEvent.DIRECTORY_UPDATED, (payload) => broadcastToRoom(SocketEvent.DIRECTORY_UPDATED, payload));
    socket.on(SocketEvent.DIRECTORY_RENAMED, (payload) => broadcastToRoom(SocketEvent.DIRECTORY_RENAMED, payload));
    socket.on(SocketEvent.DIRECTORY_DELETED, (payload) => broadcastToRoom(SocketEvent.DIRECTORY_DELETED, payload));

});

app.get("/health", (req, res) => res.status(200).send("OK"));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "..", "public", "index.html")));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));