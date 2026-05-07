import {io} from "socket.io-client";

const userId = process.argv[2] || 1;

console.log(`Starting test client for User ID: ${userId}`);

const socket = io("http://localhost:3000",{
    auth: {
        userId: Number(userId)
    }
});

socket.on("connect", () => {
    console.log(`✅ Connected as User ${userId}. Socket ID: ${socket.id}`);
});

socket.on("user_online", (data) => {
    console.log("📢 Broadcast:", data);
});

socket.on("connect_error", (err) => {
    console.error("❌ Connection Error:", err.message);
});