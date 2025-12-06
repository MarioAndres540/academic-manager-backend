import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import {Server} from "socket.io";
import { connectDB } from '../src/config/database';

import subjectsRouter from '../src/modules/subjects/subject.routes';
import gradeRoutes from '../src/modules/grades/grade.routes';
import {initSocket} from "../src/websocket/socketManager";

export const app = express();
export const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});


connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/subjects", subjectsRouter);
app.use("/api/grades", gradeRoutes);

initSocket(io);