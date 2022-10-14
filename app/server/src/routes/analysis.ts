import express from "express";
import { checkAuth } from "../middleware/checkAuth";

const router = express.Router();
const puppeteer = require('puppeteer');
const Sentiment = require('sentiment');
const sentiment = new Sentiment()

// Endpoint to start web scraper for reddit r/stocks
router.get("/r/stocks", checkAuth, async (req, res) => {

const sentimentData = async () => {
    
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0); 
    let scrapedText = ""
    let commentsDisplay = 0
    while (commentsDisplay < 201) {
        try {
            await page.goto(`https://www.reddit.com/r/stocks/comments/?count=${commentsDisplay}`, { waitUntil: "load", timeout: 0});
            const text = await page.$eval("*", (el: any) => el.innerText);
            scrapedText += text
            commentsDisplay += 25
        } catch (error: any) {
            console.log(error.message)
            return res.json({
                data: "",
                errors: error.message
            })
        }
    };
    const result = await sentiment.analyze(scrapedText)
    await browser.close()
    return res.json({
        data: [{
            "score": result.score,
            "comparative": result.comparative,
            "AFINN": result.calculation.length,
            "tokens": result.tokens.length,
        }],
        errors: ""
    })
};

try {
    sentimentData()
} catch (error: any) {
    console.log(error.message)
    return res.json({
        data: "",
        errors: error.message
    })
}

});

// Endpoint to start web scraper for reddit r/investing
router.get("/r/investing", checkAuth, async (req, res) => {

const sentimentData = async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0); 
    let scrapedText = ""
    let commentsDisplay = 0
    while (commentsDisplay < 201) {
        try {
            await page.goto(`https://www.reddit.com/r/investing/comments/?count=${commentsDisplay}`, { waitUntil: "load", timeout: 0});
            const text = await page.$eval("*", (el: any) => el.innerText);
            scrapedText += text
            commentsDisplay += 25
        } catch (error: any) {
            console.log(error.message)
            return res.json({
                data: "",
                errors: error.message
            })
        }
    };
    const result = await sentiment.analyze(scrapedText)
    await browser.close()
    return res.json({
        data: [{
            "score": result.score,
            "comparative": result.comparative,
            "AFINN": result.calculation.length,
            "tokens": result.tokens.length,
        }],
        errors: ""
    })
};

try {
    sentimentData()
} catch (error: any) {
    console.log(error.message)
    return res.json({
        data: "",
        errors: error.message
    })
}

});

// Endpoint to start web scraper for reddit r/CryptoMarkets
router.get("/r/cryptomarkets", checkAuth, async (req, res) => {

const sentimentData = async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0); 
    let scrapedText = ""
    let commentsDisplay = 0
    while (commentsDisplay < 201) {
        try {
            await page.goto(`https://www.reddit.com/r/CryptoMarkets/comments/?count=${commentsDisplay}`, { waitUntil: "load", timeout: 0});
            const text = await page.$eval("*", (el: any) => el.innerText);
            scrapedText += text
            commentsDisplay += 25
        } catch (error: any) {
            console.log(error.message)
            return res.json({
                data: "",
                errors: error.message
            })
        }
    };
    const result = await sentiment.analyze(scrapedText)
    await browser.close()
    return res.json({
        data: [{
            "score": result.score,
            "comparative": result.comparative,
            "AFINN": result.calculation.length,
            "tokens": result.tokens.length,
        }],
        errors: ""
    })
};

try {
    sentimentData()
} catch (error: any) {
    console.log(error.message)
    return res.json({
        data: "",
        errors: error.message
    })
}

});

export default router

// For comment sentiment: https://www.reddit.com/r/stocks/comments/?count=XX