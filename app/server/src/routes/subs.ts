import express from "express";
import User from "../models/user";
import { checkAuth } from "../middleware/checkAuth";
import { stripe } from "../utils/stripe";

const router = express.Router();

// GET request to retrieve prices from Stripe.
// checkAuth used if we want only valid users to view prices
// Stripe API key is required everytime we make a request to stripe

router.get("/prices", async (req, res) => {
    const prices = await stripe.prices.list({
        apiKey: process.env.STRIPE_SECRET_KEY
    });

    return res.json(prices);
});

// POST request to create session in Stripe (For plan purchase/upgrade/downgrade)
router.post("/session", checkAuth, async (req, res) => {
    const user: any = await User.findOne({email: req.user})

    // Fetch subscription data from existing user
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

    // If user has no CURRENT subscriptions (Free user or Previously canceled), create new Stripe session
    // Immediate canceled subscriptions cannot be reactivated, and we don't allow end of period cancels.
    // Therefore, previously canceled subs will have to create new session
    if(!subscriptions.data.length || subscriptions.data[0].status === "canceled") {
        const session:any = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: req.body.priceId,
                    quantity: 1
                }
            ],
            success_url: "https://tradewise-demo.netlify.app/dashboard",
            cancel_url: "https://tradewise-demo.netlify.app/plans",
            customer: user.customerStripeId,
        }, {
            apiKey: process.env.STRIPE_SECRET_KEY
        });
    
        return res.json(session) 
    };
    
    // If user has current active subscriptions, update to new subscription
    const subId = subscriptions.data[0].items.data[0].subscription
    const sub_details = await stripe.subscriptions.retrieve(subId, {apiKey: process.env.STRIPE_SECRET_KEY});

    await stripe.subscriptions.update(subId, {
    cancel_at_period_end: false,
    proration_behavior: 'always_invoice',
    items: [{
        id: sub_details.items.data[0].id,
        price: req.body.priceId,
    }],
    }, {
        apiKey: process.env.STRIPE_SECRET_KEY
    });

    // Fetch updated subscription data from existing user & return details
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

    const plan = updatedSub.data[0].items.data[0].plan.nickname;

    return res.json({
        data: {
            sub_status: updatedSub.data[0].status,
            canceled_at: [],
            current_plan: plan,
        },
        errors: [],
        url: "https://tradewise-demo.netlify.app/dashboard",
    });



});

export default router