const express = require('express');
const { Bid } = require('./models/bid.model');
const axios = require('axios');
const app = express();
const { ObjectId } = require('mongodb');

var bodyParser = require('body-parser')
// parse application/json
app.use(bodyParser.json())

const port = 3000

/**
 * Getting all bids
 */
app.get('/api/v1/bids', async (req, res) => {
  const bids = await Bid.find({ bidStatus: { $ne: "awaited" } });
  console.log(bids)
  res.status(200).send({ "bids": bids });
});

/**
 * Getting single bid
 */
app.get('/api/v1/bids/:bidId', async (req, res) => {
  const bidId = req.params.bidId;
  const bid = await Bid.findOne({ _id: new ObjectId(bidId) });
  console.log(bid)
  res.status(200).send({ "bid": bid });
});

app.post('/api/v1/bids/:bidId/award', async (req, res) => {
  const { bidId } = req.params;
  try {
    const bid = await Bid.updateOne({ _id: bidId }, { bidStatus: 'awaited' }, { new: true });
    console.log(bid)

    var data = JSON.stringify({
      "clientId": "testClient01",
      "userAddress": "0xc5d5DBAC21FcEd55Bb055a44c9A7d80F827560F5",
      "to": "0x974E58FF0E7650447136392CD2391Acd96DFf470",
      "contractAddress": "0x40834868130e830e66d896bf2a7e9b79bf05f6a6",
      "name": "CS:GO Skin Award Received!",
      "abi": JSON.stringify([{"inputs":[{"internalType":"uint256","name":"initialSupply","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"airDropToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]),
      "webhookUrl": "http://localhost:3000/webhooks/transactionUpdated",
      "metaData": JSON.stringify(bid)
    });

    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/api/v1/transactions',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        console.log(bidId,new ObjectId(bidId));
        await Bid.updateOne({ _id: new ObjectId(bidId) }, {  transactionId: response.data.id });
      })
      .catch(function (error) {
        console.log(error);
      });

    res.status(200).send(bid);
  } catch (e) {
    res.send("Internal Server Error!", e)
  }

});


app.all('/webhooks/transactionUpdated', async (req, res) => {
  try {
    console.log(req.body)
    await Bid.updateOne({ transactionId: req.body.id }, { bidStatus: req.body.status, txHash: req.body.txHash });
  } catch (e) {
    console.log("error in transactionUpdated webhook", e);
  }
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = { app }