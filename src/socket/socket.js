import {Server}from 'socket.io';
import express from 'express';
import {createServer} from 'node:http'
const app = express();
const server = createServer(app);

const allowedOrigins = ['http://localhost:5173','https://chatappv13frontend6721.netlify.app',process.env.BASE_URL];
const io = new Server(server,{
    cors:{ 
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        credentials: true,
}})

export {app,server,io};
