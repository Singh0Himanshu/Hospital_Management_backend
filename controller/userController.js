import {catchAsyncErrors} from '../middleware/catchAsyncErrors.js';
import ErrorHandler from '../middleware/errorMiddleware.js';
import { User } from '../models/userSchema.js';
import { generateToken } from '../utils/jwtToken.js';
import cloudinary from "cloudinary"


export const patientRegister = catchAsyncErrors(async (req,res,next) =>{
    const{firstName,lastName,email,phone,password,gender,dob,nic,role} = req.body;
    if(!firstName|| !lastName || !email || !phone || !password|| !gender || !dob || !nic || !role){
        return next(new ErrorHandler("Enter all the field correctly",400));
    }

    let user = await User.findOne({email})
    if(user){
        return next(new ErrorHandler("User already Registered",400));
    }
    user = await User.create({
            firstName,lastName,email,phone,password,gender,dob,nic,role,
    })

    generateToken(user, "Registered Successfully!", 201, res);
    // res.status(200).json({
    //     success:true,
    //     message:"user registered",
    // });
})


export const login = catchAsyncErrors(async (req,res,next) =>{
    const{email,password,confirmPassword,role} = req.body;
    if(!email || !password || !confirmPassword || !role){
        return next(new ErrorHandler("Enter all the field correctly",400));
    }

    if(password !== confirmPassword){
        return next(new ErrorHandler('Password and ConfirmPassword do not match',400))
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid password or email",400))
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }
    console.log(user.role);            // direct access
    console.log(user.toObject());
    if(role != user.role)return next(new ErrorHandler("user with this role is not found",400));

    generateToken(user, "Login Successfully!", 201, res);

    // res.status(200).json({
    //    success:true,
    //    message:"User logged in successfully",
    // })
})

export const addAdmin = catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,phone,password,gender,dob,nic} = req.body;

    if(!firstName || !lastName || !gender || !dob || !nic || !phone || !email || !password){
        return next(new ErrorHandler("Enter all the field correctly",400));
    }

    let isRegistered = User.findOne({email})
    if(!isRegistered){
        return next(new ErrorHandler(`${isRegistered} with this role already exist`,400));
    }

    let Admin = await User.create({
        firstName,lastName,email,phone,password,gender,dob,nic,role:"admin",
    })


    // generateToken(isRegistered, "Login Successfully!", 201, res);
    res.status(200).json({
        success:true,
        message:"New admin added successfully",
     })
})

export const getAllDoctors = catchAsyncErrors(async(req,res,next)=>{
    const doctors = await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctors
    })
})

export const getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success:true,
        user
    });
})

export const logoutAdmin = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("adminToken","",{
        httpOnly:true,
        expires: new Date(Date.now()),
        secure:true,
        SameSite:"None",
        path:"/"
    }).json({
        success:true,
        message:"Admin logout successfully!"
    })
})


export const logoutPatient = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("patientToken","",{
        httpOnly:true,
        expires: new Date(Date.now()),
        secure:true,
        SameSite:"None",
        path:"/"
    }).json({
        success:true,
        message:"Patient logout successfully!"
    })
})

export const addDoctor = catchAsyncErrors(async(req,res,next)=>{
    // || Object.keys(req.files).length === 0
     if(!req.files){
        return next(new ErrorHandler("Doctor avtar required",400))
     }

     const {docAvtar} = req.files;

     const allowedFormats = ["image/png","image/jpeg","image/webp"]

      //mimetype give the type of the document coming from frontend.
     if(!allowedFormats.includes(docAvtar.mimetype)){
          return next(new ErrorHandler("File Format not supported",400))
     }
     const {firstName,lastName,email,phone,password,gender,dob,nic,role,doctorDepartment} = req.body;
     if(!firstName|| !lastName || !email || !phone || !password|| !gender || !dob || !nic || !role || !doctorDepartment){
        next(new ErrorHandler("Provide all the field",400))
     }

     const isRegistered =await User.findOne({email})
     if(isRegistered)return next(new ErrorHandler(`${isRegistered.role} already registered`,400));
     
     const cloudinaryResponse = await cloudinary.uploader.upload(docAvtar.tempFilePath);
     if(!cloudinaryResponse || cloudinaryResponse.error){
        console.log("Clouddinary Error:", cloudinaryResponse.error || "unknown Cloudinary Error")
    }

    const doctors = await User.create({
        firstName,lastName,email,phone,password,gender,dob,nic,role,doctorDepartment,role:"Doctor",docAvatar:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        }
    });
    res.status(200).json({
        success:true,
        message:"New Doctor Registered",
        doctors
    })
})