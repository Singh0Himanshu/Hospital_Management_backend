import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema =  new mongoose.Schema({
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
                minLength:[11,"Enter valid phone number"],
                maxLength:[11,"Enter valid phone number"]
            },
            nic:{
                type:String,
                require:true,
                minLength:[13,"Nic must Contain 13 didgit"],
                maxLength:[13,"Nic must Contain exact 13 didgit"]
            },
            dob:{
                type:Date,
                require:true,
            },
            gender:{
                type:String,
                require:true,
                enum:["Male","Female"]
            },
            role:{
                type:String,
                required:true,
                enum:["admin","Patient","Doctor"],
            },
            password:{
                type:String,
                minLength:[6,"Password must contain 6 digit"],
                require:true,
                select:false,
            },
            doctorDepartment:{
                type:String
            },
            docAvatar:{
                public_id:String,
                url:String,
            }
})

//It is a function that run before data save to mongoose
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});



userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES,
    });
};
export const User = mongoose.model("User",userSchema);