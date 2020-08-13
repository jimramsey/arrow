const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Trade = require("../../models/Trade");
const User = require("../../models/User");

const getDaysHeld = (openDate, closeDate) => {
  var newOpenDate = new Date(openDate);
  var newCloseDate = new Date(closeDate);
  var daysHeld = (newCloseDate - newOpenDate) / (1000 * 60 * 60 * 24);
  return daysHeld;
};

const getProfit = (
  openPrice,
  closePrice,
  openFees,
  closeFees,
  quantity,
  buySell
) => {
  var profit;
  if (buySell === "sell") {
    profit =
      (openPrice * 100 - closePrice * 100) * parseInt(quantity) -
      (openFees * 100 + closeFees * 100) / 100;
  } else if (buySell === "buy") {
    profit =
      (closePrice * 100 - openPrice * 100) * parseInt(quantity) -
      (openFees * 100 + closeFees * 100) / 100;
  }
  return profit;
};

const getAnnualizedReturn = (profit, daysHeld, collateral) => {
  console.log(profit, daysHeld, collateral);
  var ar;
  var percentOfYear = daysHeld / 365;
  // this is for a Cash-secured Put.
  // TODO add other items
  var r = (collateral + profit) / collateral;
  var t = 1 / percentOfYear;
  ar = Math.pow(r, t) - 1;
  ar = Math.round(ar * 100 * 100) / 100;
  return ar;
};

const processTrades = (trade) => {
  const totals = {
    profit: null,
    roi: null,
    annualizedReturn: null,
    daysHeld: null,
    collateral: null,
  };

  // Set collateral based on the type of trade
  if (trade.tradeType.type === "option" && trade.tradeType.strategy === "csp") {
    console.log(trade);
    totals.collateral = trade.open.legs[0].strikePrice * 100;
  } else if (
    trade.tradeType.type === "option" &&
    trade.tradeType.strategy === "pcs"
  ) {
    console.log(trade);
    totals.collateral =
      trade.open.legs[0].strikePrice * 100 -
      trade.open.legs[1].strikePrice * 100;
  } else if (
    trade.tradeType.type === "option" &&
    trade.tradeType.strategy === "ccs"
  ) {
    console.log(trade);
    totals.collateral =
      trade.open.legs[1].strikePrice * 100 -
      trade.open.legs[0].strikePrice * 100;
  } else if (
    trade.tradeType.type === "option" &&
    trade.tradeType.strategy === "straddle"
  ) {
    console.log(trade);
    totals.collateral = trade.open.price * 100;
  }

  totals.profit = getProfit(
    trade.open.price,
    trade.close.price,
    trade.open.fees,
    trade.close.fees,
    trade.quantity,
    trade.buySell
  );
  totals.daysHeld = getDaysHeld(trade.open.date, trade.close.date);

  totals.annualizedReturn = getAnnualizedReturn(
    totals.profit,
    totals.daysHeld,
    totals.collateral
  );
  console.log(totals);
  return totals;
};

// @route   Post api/trades
// @desc    Add a trade
// @access  Private
router.post(
  "/",
  [
    auth,
    [check("company", "Company ticker symbol is required").not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newTrade = new Trade({
        company: req.body.company,
        brokerageAcct: req.body.brokerageAcct,
        tradeType: req.body.tradeType,
        status: req.body.status,
        buySell: req.body.buySell,
        user: req.user.id,
        quantity: req.body.quantity,
        open: req.body.open,
        close: req.body.close,
        notes: req.body.notes,
      });

      if (newTrade.close.legs[0].close === 0) {
        newTrade.close.legs[0].strikePrice = newTrade.open.legs[0].strikePrice;
      }
      if (!newTrade.close.legs[0].expiry) {
        newTrade.close.legs[0].expiry = newTrade.open.legs[0].expiry;
      }

      const totals = processTrades(newTrade);
      newTrade.totals = totals;

      const trade = await newTrade.save();

      res.json(trade);
    } catch (err) {
      console.error(err.message);
      res.status(500).send(config.get("errorMessageServer"));
    }
  }
);

// @route   Get api/trades
// @desc    Get all trades
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id }).sort({ company: 1 });
    res.json(trades);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(config.get("errorMessageServer"));
  }
});

// @route   Get api/trades/dates
// @desc    Get trades by dates
// @access  Private
router.get("/dates/:startDate/:endDate", auth, async (req, res) => {
  try {
    const trades = await Trade.find({
      user: req.user.id,
      "close.date": {
        $gte: new Date(req.params.startDate).setHours(00, 00, 00),
        $lt: new Date(req.params.endDate).setHours(23, 59, 59),
      },
    }).sort({ "close.date": -1 });
    res.json(trades);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(config.get("errorMessageServer"));
  }
});

// @route   Get api/trades/totals
// @desc    Get totals of all trades
// @access  Private
router.get("/totals", auth, async (req, res) => {
  console.log(req.user.id);
  try {
    const totalProfit = await Trade.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $unwind: "$totals",
      },
      {
        $group: {
          _id: null,
          totalProfit: {
            $sum: "$totals.profit",
          },
          totalCount: {
            $sum: 1,
          },
        },
      },
    ]);
    res.json(totalProfit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(config.get("errorMessageServer"));
  }
});

// @route   Get api/trades/totals/wins
// @desc    Get WINS
// @access  Private
router.get("/totals/wins", auth, async (req, res) => {
  console.log(req.user.id);
  try {
    const totalProfit = await Trade.aggregate([
      {
        $unwind: "$totals",
      },
      { $match: { "totals.profit": { $gt: 0 } } },
      {
        $group: {
          _id: null,
          totalWins: {
            $sum: 1,
          },
        },
      },
    ]);
    res.json(totalProfit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(config.get("errorMessageServer"));
  }
});

// @route   Get api/trades/totals/losses
// @desc    Get LOSSES
// @access  Private
router.get("/totals/losses", auth, async (req, res) => {
  console.log(req.user.id);
  try {
    const totalLosses = await Trade.aggregate([
      {
        $unwind: "$totals",
      },
      { $match: { "totals.profit": { $lte: 0 } } },
      {
        $group: {
          _id: null,
          totalLosses: {
            $sum: 1,
          },
        },
      },
    ]);
    res.json(totalLosses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(config.get("errorMessageServer"));
  }
});

// @route   Get api/trades/totals/all
// @desc    Get ALL STATS
// @access  Private
router.get("/totals/all", auth, async (req, res) => {
  try {
    const totalAll = await Trade.aggregate([
      {
        $facet: {
          totals: [
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            {
              $unwind: "$totals",
            },
            {
              $group: {
                _id: null,
                totalProfit: {
                  $sum: "$totals.profit",
                },
                totalCount: {
                  $sum: 1,
                },
              },
            },
          ],
          wins: [
            {
              $unwind: "$totals",
            },
            {
              $match: {
                $and: [
                  { user: new mongoose.Types.ObjectId(req.user.id) },
                  { "totals.profit": { $gt: 0 } },
                ],
              },
            },
            {
              $group: {
                _id: null,
                totalWins: {
                  $sum: 1,
                },
              },
            },
          ],
          losses: [
            {
              $unwind: "$totals",
            },
            {
              $match: {
                $and: [
                  { user: new mongoose.Types.ObjectId(req.user.id) },
                  { "totals.profit": { $lte: 0 } },
                ],
              },
            },
            {
              $group: {
                _id: null,
                totalLosses: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
    ]);
    let [totals] = totalAll;
    res.json(totals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(config.get("errorMessageServer"));
  }
});

//.find({ user: req.user.id })
//sum: { totals: { profit: { $sum: "$profit" } } },

// @route   Get api/trades/:id
// @desc    Get trade by id
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ msg: "Trade not found" });
    }

    res.json(trade);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Trade not found" });
    }
    res.status(500).send(config.get("errorMessageServer"));
  }
});

// @route   Get api/trades/:id
// @desc    Delete a trade
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) {
      return res.status(404).json({ msg: "Trade not found" });
    }
    // check user
    if (trade.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    } else {
      await trade.remove();
      res.json({ msg: "Trade deleted" });
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Trade not found" });
    }
    res.status(500).send(config.get("errorMessageServer"));
  }
});

module.exports = router;
