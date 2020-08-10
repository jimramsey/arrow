const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TradeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  company: {
    type: String,
    required: true,
  },
  brokerageAcct: {
    type: Schema.Types.ObjectId,
    ref: "profile.accounts",
  },
  tradeType: {
    type: Object,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  buySell: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  open: {
    date: Date,
    price: Number,
    fees: Number,
    legs: [
      {
        expiry: Date,
        strikePrice: Number,
      },
    ],
  },
  close: {
    date: Date,
    price: Number,
    fees: Number,
    legs: [
      {
        expiry: Date,
        strikePrice: Number,
      },
    ],
  },
  totals: {
    type: Object,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Trade = mongoose.model("trade", TradeSchema);
