import express, { urlencoded } from 'express';
import { config } from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { dbConnection } from './database/dbConnection.js';
import messageRouter from './router/messageRouter.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import userRouter from './router/userRouter.js'
import appointRouter from "./router/appointRouter.js"


const app = express();
config({path:"./config.env"});

// middleware to connect frontend and backend
//CORS:cross oriigin resource sharing help to share resources from two different port. Browser stop the sharing of resource cross origin by default.To prevent from this we use cors.
app.use(cors({
    origin:[process.env.FRONTEND_URL,process.env.DASHBOARD_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
}));

app.use(cookieParser());

// Body parsers
app.use(express.json()); //Used to stringify the data
app.use(express.urlencoded({ extended: true }));//A built-in middleware function in Express.Parses incoming requests with URL-encoded payloads.Adds the parsed data to req.body.
app.use(
    fileUpload({
    useTempFiles:"true",
    tempFileDir:"/temp/",
    })
);


app.use("/api/v1/message",messageRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/appoint",appointRouter);



dbConnection();

app.use(errorMiddleware);
export default app;