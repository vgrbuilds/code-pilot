import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_DB_URI, {
            dbName: process.env.MONGO_DB_NAME
        });
        console.log("MongoDB connected:", connection.connection.host);
    }
    catch (error){
        console.error("Error connecting to MongoDB:", error);
        console.error(error.message);
        process.exit(1);
    }

};

export default connectDB;