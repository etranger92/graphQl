const {
  connectToMongoDB
} = require('./config/mongodb');
const express = require('express');
const {
  graphqlHTTP
} = require('express-graphql');
const app = express();
const schema = require('./schemas/graphql/schema');
const cors = require('cors');

//Config
connectToMongoDB();

//Allow cross server
app.use(cors());

//Midleware attached to graphqlHTTP as graphqlHTTP and express knows how to interact with each other.
//{} => pass a schema inside it
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    //We had the graphql interface for the front end. Click to the doc and you have a representation
    /* copy past this in the front end and play
    {
      book(id:"1"){
        name
        genre
        id
      }
    }*/
    //(2)
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log('now listening to port: 4000');
});