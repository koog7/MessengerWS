import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import * as mongoose from "mongoose";
import UserRouter from "./routes/UserRouter";

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());
app.use(express.json())
app.use('/users' , UserRouter)

const router = express.Router();

const run = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/messenger');
        console.log('Connected to MongoDB');
    }catch (e){
        console.error('Error connecting to MongoDB:', e)
    }
    app.listen(port, () => {
        console.log('We are live on http://localhost:' + port);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
}

run()