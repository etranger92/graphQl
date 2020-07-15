import {
    gql
} from 'apollo-boost';

// (7)
const getAuthorsQuery = gql `
    {
        authors {
            name
            id
        }
    }
`;

const getBooksQuery = gql `
    {
        books {
            name
            id
        }
    }
`;

//We pass variables under the following format. Note: "!" = no null (must be provided)
const addBookMutation = gql `
    mutation AddBook($name: String!, $genre: String!, $authorId: ID!){
        addBook(name: $name, genre: $genre, authorId: $authorId){
            name
            id
        }
    }
`;

const getBookQuery = gql `
    query GetBook($id: ID){
        book(id: $id) {
            id
            name
            genre
            author {
                id
                name
                age
                books {
                    name
                    id
                }
            }
        }
    }
`;

export {
    getAuthorsQuery,
    getBooksQuery,
    addBookMutation,
    getBookQuery
};