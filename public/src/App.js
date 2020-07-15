import React, { Component } from 'react';

//Import apollo for graphql
//react-apollo is the articulation between them
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
// components
import AddBook from './components/AddBook';
import BookList from './components/BookList';

//Apollo client setup:
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div id='main'>
          <h1>Ninja's Reading List</h1>
          <BookList />
          <AddBook />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
