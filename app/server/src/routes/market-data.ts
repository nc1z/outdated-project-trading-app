import axios from "axios";
import express, { response } from "express";
import { checkAuth } from "../middleware/checkAuth";
const router = express.Router();
const { Spot } = require('@binance/connector');
const Alpaca = require('@alpacahq/alpaca-trade-api');

// Binance Endpoints
router.get("/bn/depth", checkAuth, async (req, res) => {
    
    const client = new Spot(process.env.BINANCE_PUBLISHABLE_KEY as string, process.env.BINANCE_SECRET_KEY as string)
    
    try {
        const { data: response } = await client.depth('btcusdt', { limit: 10 })
        return res.json({
            data: response,
            errors: "",
        })
    } catch(error:any) {
        console.log("Binance (Depth):" + error.message)
        return res.json({
            data: "",
            errors: error.message,
        })
    }


});

router.get("/bn/tape", checkAuth, async (req, res) => {
    const client = new Spot(process.env.BINANCE_PUBLISHABLE_KEY as string, process.env.BINANCE_SECRET_KEY as string)
    try {
        const { data: response } = await client.trades('btcusdt', { limit: 20 })
        return res.json({
            data: response,
            errors: "",
        })
    } catch(error:any) {
        console.log("Binance (Tape):" + error.message)
        return res.json({
            data: "",
            errors: error.message,
        })
    }

});

// FTX Endpoints

router.get("/ftx/depth", checkAuth, async (req, res) => {
    try {
        const { data: response } = await axios.get("https://ftx.com/api/markets/BTC/USD/orderbook?depth=10")
        if(response.success){
            return res.json({
                data: response,
                errors: "",
            })
        }
    } catch(error:any) {
        console.log("FTX (Depth):" + error.message)
        return res.json({
            data: "",
            errors: error.message,
        })
    }

});

router.get("/ftx/tape", checkAuth, async (req, res) => {
    try {
        const { data: response } = await axios.get("https://ftx.com/api/markets/BTC/USD/trades")
        if(response.success){
            return res.json({
                data: response,
                errors: "",
            })
        }
    } catch(error:any) {
        console.log("FTX (Tape):" + error.message)
        return res.json({
            data: "",
            errors: error.message,
        })
    }

});

router.get("/ftx/markets", checkAuth, async (req, res) => {
    try {
        const { data: response } = await axios.get("https://ftx.com/api/markets")
        if(response.success){
            return res.json({
                data: response.result.filter((each: any) => each.name === "BTC-PERP" || each.name === "ETH-PERP"),
                errors: "",
            })
        }
    } catch(error:any) {
        console.log("FTX (Markets):" + error.message)
        return res.json({
            data: "",
            errors: error.message,
        })
    }

});


// Bybit Endpoints

router.get("/bybit/depth", checkAuth, async (req, res) => {
    try {
        const { data: response } = await axios.get("https://api-testnet.bybit.com/v2/public/orderBook/L2?symbol=BTCUSD")
        if(response){
            return res.json({
                data: response,
                errors: "",
            })
        }
    } catch(error:any) {
        console.log("Bybit (Depth):" + error.message)
        return res.json({
            data: "",
            errors: error.message,
        })
    }

});

router.get("/bybit/tape", checkAuth, async (req, res) => {
     try {
         const { data: response } = await axios.get("https://api-testnet.bybit.com/v2/public/trading-records?symbol=BTCUSD&limit=20")
         if(response){
             return res.json({
                 data: response,
                 errors: "",
             })
         }
     } catch(error:any) {
         console.log("Bybit (Tape):" + error.message)
         return res.json({
             data: "",
             errors: error.message,
         })
     }
 });


// Coingecko Endpoint
router.get("/cg/trend", checkAuth, async (req, res) => {
     try {
         const { data: response } = await axios.get("https://api.coingecko.com/api/v3/search/trending")
         if(response){
             return res.json({
                 data: response,
                 errors: "",
             })
         }
     } catch(error:any) {
         console.log("Coingecko (Trend):" + error.message)
         return res.json({
             data: "",
             errors: error.message,
         })
     }
 });

router.get("/cg/price-change", checkAuth, async (req, res) => {
     try {
         const { data: response } = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=%20volume_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h")
         if(response){
             return res.json({
                 data: response,
                 errors: "",
             })
         }
     } catch(error:any) {
         console.log("Coingecko (Price-change):" + error.message)
         return res.json({
             data: "",
             errors: error.message,
         })
     }
 });

router.get("/cg/volume", checkAuth, async (req, res) => {
     try {
         const { data: response } = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=%20volume_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h")
         if(response){
             return res.json({
                 data: response,
                 errors: "",
             })
         }
     } catch(error:any) {
         console.log("Coingecko (volume):" + error.message)
         return res.json({
             data: "",
             errors: error.message,
         })
     }
 });

router.get("/cg/screener", checkAuth, async (req, res) => {
     try {
         const { data: response } = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=50&page=1&sparkline=true&price_change_percentage=24h")
         if(response){
             return res.json({
                 data: response,
                 errors: "",
             })
         }
     } catch(error:any) {
         console.log("Coingecko (Screener):" + error.message)
         return res.json({
             data: "",
             errors: error.message,
         })
     }
 });

// Alpaca Markets Endpoints
// Imported Alpaca module (see top)

const alpaca = new Alpaca({
    keyId: process.env.ALPACA_PUBLISHABLE_KEY as string,
    secretKey: process.env.ALPACA_SECRET_KEY as string,
    paper: true,
  })

router.get("/alp/screener", checkAuth, async (req, res) => {
    try {
        const symbols = ["SPY", "AAPL", "MSFT", "GOOGL", "GOOG", "AMZN", "TSLA", "BRK.B", "UNH", "JNJ", "XOM", 
        "V", "META", "JPM", "WMT", "TSM", "JPM-C", "JPM-D", "LLY", "CVX", "BAC", "PG", "NVDA", "BAC-K", "BAC-L",
        "HD", "MA", "ABBV", "NVO", "KO", "PFE", "MRK", "PEP", "BABA", "COST", "TMO", "DHR", "TM", "WFC", "AZN", "DIS", "MCD",
        "C-J", "CSCO", "ORCL", "ACN", "VZ", "NEE", "BMY", "CRM", "FMX", "TXN", "SCHW", "UPS", "ADBE", "MS", "NKE", "LIN"]

        const names: any = {
            "SPY": "SPDR S&P 500 ETF TRUST",
            "AAPL": "APPLE INC",
            "MSFT": "MICROSOFT CORP",
            "GOOGL": "ALPHABET INC-CL A",
            "GOOG": "ALPHABET INC-CL C",
            "AMZN": "AMAZON.COM INC",
            "TSLA": "TESLA INC",
            "BRK.B": "BERKSHIRE HATHAWAY INC-CL B",
            "UNH": "UNITEDHEALTH GROUP INC",
            "JNJ": "JOHNSON & JOHNSON",
            "XOM": "EXXON MOBIL CORP",
            "V": "VISA INC-CLASS A SHARES",
            "META": "META PLATFORMS INC-CLASS A",
            "JPM": "JPMORGAN CHASE & CO",
            "WMT": "WALMART INC",
            "TSM": "TAIWAN SEMICONDUCTOR-SP ADR",
            "JPM-C": "JPMORGAN CHASE & CO",
            "JPM-D": "JPMORGAN CHASE & CO",
            "LLY": "ELI LILLY & CO",
            "CVX": "CHEVRON CORP",
            "BAC": "BANK OF AMERICA CORP",
            "PG": "PROCTER & GAMBLE CO/THE",
            "NVDA": "NVIDIA CORP",
            "BAC-K": "BANK OF AMERICA CORP",
            "BAC-L": "BANK OF AMERICA CORP",
            "HD": "HOME DEPOT INC",
            "MA": "MASTERCARD INC - A",
            "ABBV": "ABBVIE INC",
            "NVO": "NOVO-NORDISK A/S-SPONS ADR",
            "KO": "COCA-COLA CO/THE",
            "PFE": "PFIZER INC",
            "MRK": "MERCK & CO. INC.",
            "PEP": "PEPSICO INC",
            "BABA": "ALIBABA GROUP HOLDING-SP ADR",
            "COST": "COSTCO WHOLESALE CORP",
            "TMO": "THERMO FISHER SCIENTIFIC INC",
            "DHR": "DANAHER CORP",
            "TM": "TOYOTA MOTOR CORP -SPON ADR",
            "WFC": "WELLS FARGO & CO",
            "AZN": "ASTRAZENECA PLC-SPONS ADR",
            "DIS": "WALT DISNEY CO/THE",
            "MCD": "MCDONALD'S CORP",
            "C-J": "CITIGROUP INC",
            "CSCO": "CISCO SYSTEMS INC",
            "ORCL": "ORACLE CORP",
            "ACN": "ACCENTURE PLC-CL A",
            "VZ": "VERIZON COMMUNICATIONS INC",
            "NEE": "NEXTERA ENERGY INC",
            "BMY": "BRISTOL-MYERS SQUIBB CO",
            "CRM": "SALESFORCE INC",
            "FMX": "FOMENTO ECONOMICO MEX-SP ADR",
            "TXN": "TEXAS INSTRUMENTS INC",
            "SCHW": "SCHWAB (CHARLES) CORP",
            "UPS": "UNITED PARCEL SERVICE-CL B",
            "ADBE": "ADOBE INC",
            "MS": "MORGAN STANLEY",
            "NKE": "NIKE INC -CL B",
            "LIN": "LINDE PLC",
        }

        const snapshots = await alpaca.getSnapshots(symbols)

        const toDisplay: any = {};
        for (const s of snapshots) {
             const values = {
              name: s.symbol,
              full: names[s.symbol],  
              open: s.DailyBar.OpenPrice,
              bid: s.LatestQuote.BidPrice,
              ask: s.LatestQuote.AskPrice,
              lastPrice: s.DailyBar.ClosePrice,
              dailyHigh: s.DailyBar.HighPrice,
              dailyLow: s.DailyBar.LowPrice,
              volume: s.DailyBar.Volume,
              spread: s.LatestQuote.BidPrice - s.LatestQuote.AskPrice,
              priceChange: s.DailyBar.ClosePrice - s.DailyBar.OpenPrice,
              percentChange: (s.DailyBar.ClosePrice / s.DailyBar.OpenPrice) * 100 - 100,
            } 
            toDisplay[(s as any).symbol] = values;
          }
          
        return res.json({
            data: toDisplay,
            errors: ""
        })

    } catch(error:any) {
        console.log("Alpaca (Screener):" + error.message)
        return res.json({
            data: "",
            errors: error.message,
        })
    }
});

router.get("/alp/news", checkAuth, async (req, res) => {
    try {

        const news_1 = await alpaca.getNews({})
        const news_2 = await alpaca.getNews({})
        const news = [...news_1, ...news_2]

        if(news) {              
            return res.json({
                data: news,
                errors: ""
            })
        }

    } catch(error:any) {
        console.log("Alpaca (News):" + error.message)
        return res.json({
            data: "",
            errors: error.message,
        })
    }
});


export default router