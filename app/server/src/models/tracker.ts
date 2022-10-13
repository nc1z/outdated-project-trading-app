import mongoose from "mongoose";

const { Schema } = mongoose;

const trackerSchema = new Schema({
    email: String,
    currentAssets: [
   {name: String, value: Number},
    ],
    tickets: [{
        ticketid: String,
        datetime: String,
        asset: String,
        order: String,
        amount: Number,
    }]
});

export default mongoose.model("Tracker", trackerSchema);