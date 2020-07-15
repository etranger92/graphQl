/*MongoDB*/

const mongoose = require('mongoose');
require('dotenv').config();
let uri = process.env.ATLAS_URI;
uri = "mongodb+srv://Nabil:Amjade2409.@books.xn7hz.mongodb.net/book?retryWrites=true&w=majority";

const connectToMongoDB = async () => {
    try {
        const mongoose = require('mongoose');
        await mongoose.connect(`${uri}` /*"mongodb+srv://Nabil:Amjade2409.@books.xn7hz.mongodb.net/book?retryWrites=true&w=majority"*/ , {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });
        const connection = mongoose.connection;
        connection.once('open', () => {
            console.log('mongoDB database connection established successfully');
        });
    } catch (err) {
        console.log(err)
    }
};

module.exports = {
    connectToMongoDB,
};