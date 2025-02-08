import express from 'express';
import path from 'path';
import dotenv from "dotenv";
import cors from "cors";
import connectDb from './db/connectDb.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/UserRoutes.js'
import postRoutes from './routes/PostRoutes.js';
import MessageRoutes from './routes/MessageRoutes.js';
import {v2 as cloudinary} from 'cloudinary';
import {app,server} from "./socket/socket.js";
import job from './crons/cron.js';
dotenv.config();
connectDb();
job.start();


app.use(cors());
const PORT=process.env.PORT ||5000;
const __dirname=path.resolve();
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({limit: '10mb',extended:true}));
app.use(cookieParser());

app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/message",MessageRoutes);


// //http://localhost:5000=>backend
//http://localhost:3000=>frontend

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}
server.listen(5000,()=>console.log(`server started at http://localhost:${PORT}`));