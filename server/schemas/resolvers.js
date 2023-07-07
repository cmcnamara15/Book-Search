const { User } = require('../models');
const { signToken } = require('../utils/auth');

module.exports ={
    Query: {
        async getSingleUser({ user = null, params }, res) {
            const foundUser = await User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
            });
        
            if (!foundUser) {
                return res.status(400).json({ message: 'Cannot find a user with this id!' });
            }
        
            res.json(foundUser);
            },
    },
    
}