const graphql = require('graphql');
//This library allows you to retrieve data from array easily instead of writing plain javascript
const _ = require('lodash');
//Schema will describe the object type and the relation between types.
//We retrieve the function from grapql

//import dumy datas
const {
  authors,
  books
} = require('../../datas/dumy.datas')
//Take mongoDb schema
const Book = require('../mongoSchema/book');
const Author = require('../mongoSchema/author');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;
//GraphQLID allows you to query your book using or a string "1" or an integer 1.


/********You create the schema********/
// (1) We define the object that we want to retrieve and here we define relations between tables
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {
      //GraphQLId could be a string or integer
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    genre: {
      type: GraphQLString,
    },
    authorId: {
      type: GraphQLString,
    },
    // (3) DEFINE RELATIONS WITH OTHERS TABLE
    //
    author: {
      type: AuthorType,
      //Resolve represents the method that will get the data
      resolve(parent, args) {
        console.log(parent.authorId, "your"); // log the book with his details parent = book details.
        //We use find as we have only one author for one book
        //Instead of _find we can use plain javascript with find method
        //To target dumy datas
        /* return _.find(authors, {
           id: parent.authorId
         });*/
        //Real data in mangoDB Author is schema of mongo
        return Author.findById(parent.authorId);
      },
    },
  }),
});
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
    //  (3) LINK with objet Book => If we query an author and we want to see his books writen
    books: {
      //We must use graphList as we return many book object of an array. We then filter it
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        console.log(parent.id, "athor")
        /*  return _.filter(books, {
            authorId: parent.id
          });*/
        return Book.find({
          authorId: parent.id
        });
      },
    },
  }),
});
//OUR ROUTE TO GRAB DATA (1)
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //HERE IT'S FOR SPECIFIC BOOK WE WANT OR AUTHOR
    book: {
      type: BookType,
      //The args with the id correspond to the id?="" in the query
      args: {
        id: {
          type: GraphQLID, //GraphQLString,
        },
      },
      resolve(parent, args) {
        // code to get data from db / other source
        //args.id  from parent(which could be an other database)
        /* return _.find(books, {
           id: args.id
         });*/
        return Book.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve(parent, args) {
        /*return _.find(authors, {
          id: args.id
        });*/
        return Author.findById(args.id);
      },
    },
    //Let's say we want all books or all authors not a specific one
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return books;
        return Book.find({});
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors;
        return Author.find({});
      },
    },
  },
});

/* Write this in the front end
{
  book(id:2) {
    name
    genre
    author{
      name
    }
  }
}
 */

//MUTATION to change data or add new author etc 

/*
//Add this to the front end to test the app
mutation {
  addAuthor(name:"Nabil", age:30){
    name
    age
  }
}
(4)
*/
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: {
          type: GraphQLString,
        },
        age: {
          type: GraphQLInt,
        },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        //save is a method from mongoDb
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: {
          // (5)
          type: new GraphQLNonNull(GraphQLString),
        },
        genre: {
          type: new GraphQLNonNull(GraphQLString),
        },
        authorId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});