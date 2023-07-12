const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }
    type User {
        username : String
        email: String
        password: String
        savedBooks: [Book]
    }
    type Query {
        me: User
    }

    type Auth {
        token: ID!
        user: User 
    }

    input BookInput {
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!): Auth   
        loginUser(email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        deleteBook(bookId: String!): User
    }
`

module.exports = typeDefs;