const mongoose = require('mongoose');
const { app } = require('./app');

async function main() {
    await mongoose.connect('mongodb+srv://MM802:zv5381peU8QOGYao@cluster0.i050q0e.mongodb.net/game-server');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


main().catch(err => console.log(err));
