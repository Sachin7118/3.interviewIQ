import mongoose from "mongoose";

const url = "mongodb+srv://demo:Sachin%40123@cluster500.pypl8zj.mongodb.net/?appName=Cluster500&retryWrites=true&w=majority";
console.log("Testing MongoDB connection with demo:Sachin@123...");

mongoose.connect(url)
  .then(() => {
    console.log("SUCCESSFULLY CONNECTED");
    process.exit(0);
  })
  .catch(err => {
    console.error("CONNECTION ERROR DETAILS:");
    console.error(err);
    process.exit(1);
  });
