const { default: mongoose } = require("mongoose");

const bidSchema = new mongoose.Schema({
    itemName: String,
    amount: Number,
    bidderAddress: String,
    bidderName: String,
    bidStatus: String,
    createdOn: Date
  });

  module.exports = {
      Bid: mongoose.model('Bid', bidSchema)
  }