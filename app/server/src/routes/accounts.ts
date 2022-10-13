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
        return res.json({
            data: [],
            errors: "You have no active subscriptions."
        });
    };

    const plan = subscriptions.data[0].items.data[0].plan.nickname;
    const subStatus = subscriptions.data[0].status
    const subExpiry = new Date(subscriptions.data[0].current_period_end * 1000)
    const subExpiryDate = `${subExpiry.getDate()}-${subExpiry.getMonth()+1}-${subExpiry.getFullYear()}`
    
    // If Subscription is already canceled, then return details of cancellation 
    if(subStatus === "canceled" && subscriptions.data[0].canceled_at !== null){
        const unsubTimeStamp = new Date(subscriptions.data[0].canceled_at * 1000)
        const unsubDateTime = `${unsubTimeStamp.getDate()}-${unsubTimeStamp.getMonth()+1}-${unsubTimeStamp.getFullYear()} at ${unsubTimeStamp.getHours() < 10 ? `0${unsubTimeStamp.getHours()}` : `${unsubTimeStamp.getHours()}`}:${unsubTimeStamp.getMinutes() < 10 ? `0${unsubTimeStamp.getMinutes()}` : `${unsubTimeStamp.getMinutes()}`}`
        return res.json({
            data: {
                sub_status: subStatus,
                canceled_at: unsubDateTime,
                sub_expiry: subExpiryDate,
                current_plan: plan,
            },
            errors: [],
        })
    }

    // If subscription is not canceled, then return current status by default
    return res.json({
        data: {
            sub_status: subStatus,
            canceled_at: [],
            sub_expiry: subExpiryDate,
            current_plan: plan,
        },
        errors: [],
    })
})

export default router

