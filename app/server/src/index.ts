import express from "express";
import authRoutes from "./routes/auth";
import subsRoutes from "./routes/subs";
import planRoutes from "./routes/plan";
import unsubRoutes from "./routes/unsub";
import accountsRoutes from "./routes/accounts";
import marketDataRoutes from "./routes/market-data";
import analysisRoutes from "./routes/analysis";
import trackRoutes from "./routes/track";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

mongoose.connect(
    process.env.MONGO_URI as string
)
.then(() => {
    console.log("Connected to mongodb");

    const PORT = process.env.PORT || 8080;
    const app = express();

    app.use(express.json());
    app.use(cors()); // ToDo: Should specify which client - localhost:3000
    app.use("/auth", authRoutes);
    app.use("/subs", subsRoutes);
    app.use("/plan", planRoutes);
    app.use("/unsub", unsubRoutes);
    app.use("/accounts", accountsRoutes);
    app.use("/market-data", marketDataRoutes);
    app.use("/analysis", analysisRoutes);
    app.use("/track", trackRoutes);
    
    app.use(express.static(path.join(__dirname, 'build')));

    app.get('/*', function(req,res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });

    app.listen(PORT, () => {
        console.log(`Now listening to port ${PORT}`);
    });
    
})
.catch((error) => {
    console.log({error})
    throw new Error(error);
})

