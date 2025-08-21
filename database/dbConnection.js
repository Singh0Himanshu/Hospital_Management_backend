import mongoose from "mongoose";

export const  dbConnection = () =>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"HospitalManagementSystemDeployment"
    })
    .then(()=>{
        console.log("Connected to database!")
    })
    .catch(()=>{
        console.log("Error on connecting to database")
    });
}