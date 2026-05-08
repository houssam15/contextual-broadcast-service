import { io } from "socket.io-client";

const CLIENT_COUNT = 10;

const SERVER_URL = "http://localhost:3000";

async function createClient(id: number) {
    const socket = io(SERVER_URL, {
        auth: { userId: id.toString() }
    });

    socket.on("connect", () => {
        console.log(`✅ Client ${id} connected (Socket: ${socket.id})`);
    });

    socket.on("user_online", (data) => {
        console.log(`Notification for Client ${id}: User ${data.name} is online`);
    });

    socket.on("disconnect", () => {
        console.log(`❌ Client ${id} disconnected`);
    });

    // Randomly disconnect after 5-15 seconds
    setTimeout(() => {
        socket.disconnect();
    }, Math.random() * 10000 + 5000);
}

console.log(`🚀 Starting simulation with ${CLIENT_COUNT} clients...`);
for (let i = 1; i <= CLIENT_COUNT; i++) {
    createClient(i);
}