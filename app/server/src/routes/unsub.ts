import express from "express";
import User from "../models/user";
import { checkAuth } from "../middleware/checkAuth";
import { stripe } from "../utils/stripe";

const router = express.Router();

// POST request to unsubscribe in Stripe (Delete request requires sub id in params, which we don't have in client)
// Notes: Require token + customerSTripeId
// Need to clean up code here, especially the double fetching
router.post("/", checkAuth, async (req, res) => {
    const user: any = await User.findOne({email: req.user})
    
    // Fetch subscription data from existing user, if no active subs, then return error.
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
    
    // Storing Subscription Id and Subscription Status into consts
    const subId = subscriptions.data[0].items.data[0].subscription
    const subStatus = subscriptions.data[0].status

    // If Subcription status is not cancelled, delete it. If unsuccessful, early return
    if(subStatus !== "canceled") {
        try {
            await stripe.subscriptions.del(subId, {apiKey: process.env.STRIPE_SECRET_KEY});
        } catch(error:any) {
            return res.json({
                data: {
                    sub_status: subStatus,
                    canceled_at: [],
                    sub_expiry: [],
                },
                errors: error.message,
            })
        }
    };

    // Need to fetch the updated list again
    const updatedSub = await stripe.subscriptions.list(
        {
            customer: user.customerStripeId,
            status: "all",
            expand: ["data.default_payment_method"]
        },
        {
            apiKey: process.env.STRIPE_SECRET_KEY
        }
    );

    // Current Period End (If sub active, this represents next billing date. Else, this is subscription expiry date.)
    const subExpiry = new Date(updatedSub.data[0].current_period_end * 1000)
    const subExpiryDate = `${subExpiry.getDate()}-${subExpiry.getMonth()+1}-${subExpiry.getFullYear()}`
    
    // If subscription was cancelled, return Date & Time of Cancellation
    if(updatedSub.data[0].canceled_at !== null) {
        const unsubTimeStamp = new Date(updatedSub.data[0].canceled_at * 1000)
        const unsubDateTime = `${unsubTimeStamp.getDate()}-${unsubTimeStamp.getMonth()+1}-${unsubTimeStamp.getFullYear()} at ${unsubTimeStamp.getHours() < 10 ? `0${unsubTimeStamp.getHours()}` : `${unsubTimeStamp.getHours()}`}:${unsubTimeStamp.getMinutes() < 10 ? `0${unsubTimeStamp.getMinutes()}` : `${unsubTimeStamp.getMinutes()}`}`
        return res.json({
            data: {
                sub_status: updatedSub.data[0].status,
                canceled_at: unsubDateTime,
                sub_expiry: subExpiryDate,
            },
            errors: [],
            url: "http://localhost:3000/account",
        })
    }

    // If not, then return status
    return res.json({
        data: {
            sub_status: updatedSub.data[0].status,
            canceled_at: [],
            sub_expiry: subExpiryDate,
        },
        errors: [],
        url: "http://localhost:3000/account",
    })

});

export default router