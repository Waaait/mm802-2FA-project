const { default: mongoose } = require("mongoose");

const bidSchema = new mongoose.Schema({
    itemName: String,
    amount: Number,
    bidderAddress: String,
    bidderName: String,
    bidStatus: String,
    createdOn: Date,
    transactionId: String,
    txHash: String
  });

  module.exports = {
      Bid: mongoose.model('Bid', bidSchema)
  }