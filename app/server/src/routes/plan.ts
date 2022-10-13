import express from "express";
import User from "../models/user";
import { checkAuth } from "../middleware/checkAuth";
import { stripe } from "../utils/stripe";

const router = express.Router();

// Endpoint /plan to get stripe subscriptions, and sending it back as response
router.get("/", checkAuth, async (req, res) => {
    const user: any = await User.findOne({email: req.user});

    const subscriptions = await stripe.subscriptions.list(
        {
            customer: user.customerStripeId,
            status: "all",
            expand: ["data.default_payment_method"]
        },
        {
            apiKey: process.env.STRIPE_SECRET_KEY
        }
    );

    if(!subscriptions.data.length) {
        return res.json("none");
    };

    //@ts-ignore 
    const plan = subscriptions.data[0].plan.nickname;

    return res.json(plan)
})

export default router