// class isliye use kr rhe h kyuki Error ek in-build class h javascript me jise ki hme sirf extend krna h aur use krna h.
class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;

        // Error.captureStackTrace(this, this.constructor);
    }
}

//this is central error handler. it send default error if type of error not found. ye error to recieve krna h jo next ke through ata  async se.
export const errorMiddleware = (err,req,res,next)=>{
    err.message = err.message || "internal server error";
    // res.status(err.statusCode || 500)
    err.statusCode = err.statusCode || 500;


    if(err.name === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400)
    }
    if(err.name === "JsonWebTokenError"){
        const message = `Json web token is Inavlid,try Again!`;
        err = new ErrorHandler(message,400)
    }
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is expired. try again`;
        err = new ErrorHandler(message,400)
    }
    if(err.name === "CastError"){ // validation error ata h isme. like 'type'.
        const message = `Inavlid ${err.path}`;
        err = new ErrorHandler(message,400)
    }

    const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;
    
     console.log(errorMessage)
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
}
export default ErrorHandler;