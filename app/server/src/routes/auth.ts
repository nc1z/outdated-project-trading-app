import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { checkAuth } from "../middleware/checkAuth";
import { stripe } from "../utils/stripe";

const router = express.Router();

// SIGNUP POST REQUEST

router.post('/signup',
    // username must be an email
    body("email").isEmail().withMessage("Please enter a valid email."),
    // password must be at least 6 chars long
    body("password").isLength({ min: 6 }).withMessage("Password should be at least 6 characters."),
    // Rest of Post Request 
    async (req, res) => {

        // If there's errors, this returns an array of errors & we'll map it out
        const validationErrors: any = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const errors = validationErrors.array().map((error: any) => {
                return {
                    msg: error.msg,
                }
            });

            return res.json({errors, data: null});
        }

        // Getting email & password from request body

        const { email, password } = req.body;

        // Check for matching email in mongoDB

        const user = await User.findOne({ email });

        if(user) {
            return res.json({
                errors: [
                    {
                        msg: "Email already in use.",
                    },
                ],
                data: null,
            });
        }

        // Hashing password and saving new user to DB if above validations pass.
        // Also creating a Stripe customer at the same time.

        const hashedPassword = await bcrypt.hash(password, 10);

        const customer = await stripe.customers.create({
            email,
        }, {
            apiKey: process.env.STRIPE_SECRET_KEY,
        });

        const newUser = await User.create({
            email,
            password: hashedPassword,
            customerStripeId: customer.id,
        });

        // Creating Token - passing email as payload

        const token = await JWT.sign(
            { email: newUser.email },
            process.env.JWT_SECRET as string,
            {
                expiresIn: 86400
            }
        );

        // Return Response from Post req containing the token and new user details
         
        res.json({
            errors: [],
            data: {
                token,
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    customerStripeId: customer.id,
                },
            },
        });
});

// LOGIN POST REQUEST

router.post('/login', async (req, res) => {

    // Getting email and password from request body
    const { email, password } = req.body;

    // Checking for matching email in mongoDB
    const user = await User.findOne({email});

    if(!user) {
        return res.json({
            errors: [
                {
                    msg: "Invalid credentials",
                },
            ],
            data: null
        });
    };

    // Compare passwords using bcrypt & return error if no match
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        return res.json({
            errors: [
                {
                    msg: "Invalid credentials",
                },
            ],
            data: null
        });
    };

    // Creating JWToken. This time we pass in user rather than newUser.

    const token = await JWT.sign(
        { email: user.email },
        process.env.JWT_SECRET as string,
        {
            expiresIn: 86400
        }
    );
    
    // Return Response from Post req containing the token and existing user details
    return res.json({
        errors: [],
        data: {
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        },
    });
});

// Middleware (checkAuth) for protected routes. 
// On passing middleware, find user in database (with email) & return id and email to client
// Client-side will fetch response via GET request from /me route

router.get('/me', checkAuth, async (req, res) => {
    const user: any = await User.findOne({ email: req.user });

    return res.json({
        errors: [],
        data: {
            user: {
                id: user._id,
                email: user.email,
                customerStripeId: user.customerStripeId,
            },
        },
    });
});

export default router