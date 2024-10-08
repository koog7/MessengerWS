import express from "express";
import User from "../models/User";
import mongoose from "mongoose";
import {randomUUID} from "node:crypto";
import bcrypt = require("bcrypt");

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post("/", async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });

        if (existingUser) {
            return res.status(400).send({ message: 'Username already taken' });
        }

        const user = new User({
            username: req.body.username,
            password: req.body.password,
            displayName: req.body.displayName,
            phoneNumber: req.body.phoneNumber,
            token: randomUUID(),
        })

        await user.save()
        res.send(user)

    }catch (e) {
        if(e instanceof mongoose.Error.ValidationError){
            return res.status(400).send(e)
        }
        return next(e)
    }
})


userRouter.post('/sessions' , async (req , res , next) => {
    try{
        const user = await User.findOne({username: req.body.username})

        if(!user){
            return res.status(400).send({error:'User or password are wrong'})
        }

        const comparePswrd = await bcrypt.compare(req.body.password , user.password)

        if(!comparePswrd){
            return res.status(400).send({error:'User or password are wrong'})
        }

        user.token = randomUUID();

        await user.save()
        res.send(user)
    }catch (e) {
        if(e instanceof mongoose.Error.ValidationError){
            return res.status(400).send(e)
        }
        return next(e)
    }
})

userRouter.delete('/sessions', async (req, res, next) => {
    try {
        const getToken = req.get('Authorization');
        const success = {message: 'Success'};

        if (!getToken) return res.send(success);

        const [_Bearer , token] = getToken.split(' ');

        const user = await User.findOne({token});

        if (!user) return res.send(success);

        user.token = randomUUID();
        user.save();

        return res.send(success);
    } catch (e) {
        return next(e);
    }
});
export default userRouter;