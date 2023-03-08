const express = require('express');
const { Bid } = require('./models/bid.model');
const axios = require('axios');
const app = express();

const port = 3000

/**
 * Getting all bids
 */
app.get('/api/v1/bids', async (req, res) => {
    const bids = await Bid.find({ bidStatus: { $ne: "awaited" } });
    console.log(bids)
    res.status(200).send({ "bids": bids });
});

app.post('/api/v1/bids/:bidId', async (req, res) => {
    const { bidId } = req.params;
    try {
        const bid = await Bid.updateOne({ _id: bidId }, { bidStatus: 'awaited' }, { new: true });
        console.log(bid)
   
        var data = JSON.stringify({
            "clientId": "testClient01",
            "userAddress": "useraddress",
            "to": "0xd27C7E2EC0a2E43b179Da36f9Cc349d733Ff368e",
            "contractAddress": "0xd27C7E2EC0a2E43b179Da36f9Cc349d733Ff368e",
            "metaData": JSON.stringify(bid)
        });

var config = {
  method: 'post',
maxBodyLength: Infinity,
  url: 'http://web3-backend:8080/api/v1/transactions',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

        res.status(200).send(bid);
    } catch (e) {
        res.send("Internal Server Error!",e)
    }

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = { app }