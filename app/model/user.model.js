import mongoose from "mongoose";
import Joi from "joi";

export const userSchemaValidation=Joi.object({
    name:Joi.string().min(2).max(25).required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    phone:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
    password:Joi.string().required()
})

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

},{timestamps:true});

export const User=mongoose.model("User",userSchema);