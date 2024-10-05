import mongoose from "mongoose";
import bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

const ForumUser = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    token:{
        type: String,
        required: true,
    }
})

ForumUser.pre('save' , async function (next){
    if(!this.isModified('password')){
        return next();
    }

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    this.password = await bcrypt.hash(this.password , salt)

    next()
})

ForumUser.set('toJSON', {
    transform: (_doc , ret) =>{
        delete ret.password;
        return ret;
    }
})


const User = mongoose.model('User' , ForumUser)

export default User;