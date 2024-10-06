import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import * as mongoose from "mongoose";
import UserRouter from "./routes/UserRouter";
import WebSocket from 'ws';
import Messages from "./models/Messages";
import User from "./models/User";

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());
app.use(express.json())
app.use('/users' , UserRouter)

const router = express.Router();

const userData: WebSocket[] = [];
const fieldData: object[] = [];

router.ws('/message', (ws, req) => {
    userData.push(ws)

    // fieldData.forEach((message) => {
    //     ws.send(message);
    // });

    ws.on('message' , async (message:string) => {
        const msg = JSON.parse(message);

        if (msg.type === 'MESSAGE') {

            const newMessage = new Messages({
                userId: msg.userId,
                message: msg.message
            });

            await newMessage.save();

            const findUser = await User.findById(msg.userId);

            if (!findUser) {
                throw new Error('User not found');
            }
            console.log(message)
            const responseMessage = {
                username: findUser.username,
                message: msg.message
            };

            fieldData.push(responseMessage);

            userData.forEach((clientWs) => {
                clientWs.send(JSON.stringify(responseMessage));
            })
        }
    })

    ws.on('close' , () => {
        const index = userData.indexOf(ws)
        userData.splice(index , 1)
    })
})

app.use(router);

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