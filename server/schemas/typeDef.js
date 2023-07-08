const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        username : String
        email: String
        password: String
        SavedBooks: [Book]
    }
    type Query {
        me: User
    }
`