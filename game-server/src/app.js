const express = require('express');
const { Bid } = require('./models/bid.model');
const app = express();

const port = 3000

/**
 * Getting all bids
 */
app.get('/api/v1/bids', async (req, res) => {
    const bids = await Bid.find({});
    console.log(bids)
    res.status(200).send(bids);
});

app.post('/api/v1/bids/:bidId',async (req, res) => {
    const { bidId } = req.params;
    const bid = await Bid.updateOne({ _id: bidId }, { bidStatus: 'awaited' });
    console.log(bid)
    res.status(200).send(bid);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = { app }