import express from "express";
import Tracker from "../models/tracker";
import { v4 as uuid } from "uuid";
import { checkAuth } from "../middleware/checkAuth";
import moment from "moment";

const router = express.Router();

// Endpoint /track/get to retrieve data
router.get("/get", checkAuth, async (req, res) => {
    const tracker:any = await Tracker.findOne({ email: req.user });

    if(!tracker){
        return res.json({
            data: "",
            errors: "User asset details not found."
        })
    }

    return res.json({
        data: tracker,
        errors: ""
    })

});

// Endpoint /track to add new ticket and update current assets for user specified
router.post("/update", checkAuth, async (req, res) => {
    const tracker:any = await Tracker.findOne({ email: req.user });

    // Tracker creation for first time creation
    try {
        if (!tracker) {
            await Tracker.create({
                email: req.user,
                currentAssets: [
                    {name: "BTC", value: 0},
                    {name: "ETH", value: 0},
                    {name: "USDT", value: 0},
                 ],
                tickets: []
            })
        }
    } catch(error:any) {
        console.log(error.message)
        return res.json({
            data: "",
            errors: error.message
        })
    }

    
    // Updating Tickets for existing users ----->
    
    // Negative balance check
    const details = await Tracker.findOne({ email: req.user });
    if (details) {
        const checkAsset = details.currentAssets.filter((each: any) => each.name === req.body.asset)
        if (checkAsset[0].value === undefined) {
            checkAsset[0].value = 0;
        }
        if ((checkAsset[0].value === 0 || checkAsset[0].value) && req.body.order === "Remove" && (checkAsset[0].value - req.body.amount) < 0) {
            return res.json({
                data: "",
                errors: "Unable to execute. Negative balance."
            })
        }
    }

    // Setting amount to negative if transaction type = remove
    let revisedAmount;
    if (req.body.order === "Remove") {
        revisedAmount = -1 * req.body.amount
    } else {
        revisedAmount = req.body.amount
    }

    // Updating database
    try {
        const ticket = {
            ticketid: uuid(),
            datetime: moment().format('MMMM Do YYYY, h:mm:ss a'),
            asset: req.body.asset,
            order: req.body.order,
            amount: revisedAmount,
        }

        await Tracker.updateOne(
            { email: req.user },
            {
              $push: {
                "tickets" : ticket
              },
              $inc: {
                "currentAssets.$[ticker].value" : ticket.amount
              }
            },
            {
                "arrayFilters": [
                    {
                        "ticker.name": ticket.asset
                    }
                ]
            },
          );

        const response = await Tracker.findOne({ email: req.user });

        if(response) {
            return res.json({
                data: response,
                errors: ""
            })
        }

    } catch(error:any) {
        console.log(error.message)
        return res.json({
            data: "",
            errors: error.message
        })
    }
})


export default router
