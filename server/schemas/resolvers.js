const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('appolo-server-express');


module.exports ={
    Query: {
        me: async function(parent, args, context) {
            const foundUser = await User.findOne({
                _id: context.user._id
            });
        
            if (!foundUser) {
                throw new AuthenticationError('Cannot find a user with this id!')
            }
        
            return(foundUser);
            },
    },
    
    Mutation: {
        createUser: async function(parent, args, context) {
            const user = await User.create(args);
        
            if (!user) {
                throw new AuthenticationError('Something is wrong!')
            }
            const token = signToken(user);
            return({ token, user });
        },
          // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
          // {body} is destructured req.body
        login: async function(parent, args, context) {
            const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
            if (!user) {
                throw new AuthenticationError("Cant Find User!")
            }
        
            const correctPw = await user.isCorrectPassword(args.password);
        
            if (!correctPw) {
                throw new AuthenticationError('Wrong Password!')
            }
            const token = signToken(user);
            res.json({ token, user });
        },
          // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
          // user comes from `req.user` created in the auth middleware function
        saveBook: async function(parent, args, context) {
            if(!context.user) {
                throw new AuthenticationError('You need to be logged in!')
            }
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.input } },
                    { new: true, runValidators: true }
            );
                return (updatedUser);
            } catch (err) {
                console.log(err);
                throw new AuthenticationError('Something is wrong!')
            }
        },
          // remove a book from `savedBooks`
        deleteBook: async function(parent, args, context) {
            if(!context.user) {
                throw new AuthenticationError('You need to be logged in!')
            }
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
            );
            if (!updatedUser) {
                throw new AuthenticationError('Something is wrong!')
            }
            return  (updatedUser);
        },
    },

}

