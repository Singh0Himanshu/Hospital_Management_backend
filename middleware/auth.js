import { request } from "express";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt, { decode } from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const isAdminAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const token = req.cookies.adminToken;

    if(!token) return next(new ErrorHandler("Admin not authenticated",400));

    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await User

    req.user = await User.findById(decoded.id);

    //authorization start from here.
    if(req.user.role !== "admin"){
        new ErrorHandler(`${req.user.role} not authorized for this role!`, 403)
    }
    next();
})


export const isPatientAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const token = req.cookies.patientToken;

    if(!token) return next(new ErrorHandler("Patient not authenticated",400));

    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await User

    req.user = await User.findById(decoded.id);

    //authorization start from here.
    if(req.user.role !== "Patient"){
        new ErrorHandler(`${req.user.role} not authorized for this role!`, 403)
    }
    next();
})