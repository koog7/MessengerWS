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

interface User {
    ws: WebSocket;
    username: string;
}

const userData: User[] = [];
const fieldData: object[] = [];

router.ws('/message', async (ws, req) => {
    const lastMessages = await Messages.find().sort({ _id: -1 }).limit(30).populate('userId', 'username');

    if(lastMessages){
        ws.send(JSON.stringify({ type:'MESSAGE' , lastMessages}));
    }

    const onlineUsers = userData.map(user => user.username);
    ws.send(JSON.stringify({ type: 'ONLINE_USERS', payload: onlineUsers }));

    ws.on('message' , async (message:string) => {
        const msg = JSON.parse(message);

        if (msg.type === 'LOGIN') {
            const user = await User.findOne({ token: msg.token });

            if (!user) {
                console.log('Not created')
                ws.send(JSON.stringify({ type: 'ERROR', payload: 'Wrong token!' }));
                ws.close();
                return;
            }

            userData.push({ ws, username: user.username });

            ws.send(JSON.stringify({ type: 'SUCCESS', payload: 'Logged in successfully!' }));

            const onlineUsers = userData.map(user => user.username);
            userData.forEach(client => {
                client.ws.send(JSON.stringify({ type: 'ONLINE_USERS', payload: onlineUsers }));
            });
        }

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

            const responseMessage = {
                type: 'MESSAGE',
                username: findUser.username,
                message: msg.message
            };

            fieldData.push(responseMessage);

            userData.forEach((client) => {
                client.ws.send(JSON.stringify(responseMessage));
            });
        }
    })

    ws.on('close' , () => {
        const index = userData.findIndex((user) => user.ws === ws);
        if (index !== -1) {
            userData.splice(index, 1);

            const onlineUsers = userData.map(user => user.username);

            userData.forEach((client) => {
                client.ws.send(JSON.stringify({ type: 'ONLINE_USERS', payload: onlineUsers }));
            });
        }
    });
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