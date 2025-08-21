import mongoose from "mongoose";
import validator from 'validator'

const messageSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"First name must contain atleast 3 character"]
    },
    lastName:{
        type:String,
        required:true,
        minLength:[3,"First name must contain atleast 3 character"]
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"Provide a valid email"]
    },
    phone:{
        type:String,
        required:true,
        minLength:[10,"Enter valid phone number"],
        maxLength:[10,"Enter valid phone number"]
    },
    message:{
        type:String,
        required:true,
        minLength:[10,"Message must contain 10 characters!"],
    },
});

export const Message = mongoose.model("Message",messageSchema);