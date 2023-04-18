const { User, Thought } = require('../models');
module.exports = {
    // Get all Users
    getUsers(req, res) {
      User.find()
        .then(async (users) => {
          const userObj = {
            users,
    
          };
          return res.json(userObj);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },
    // Get a single user
    getSingleUser(req, res) {
      User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts')
        .then(async (user) =>
          !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json({
                user,
                
              })
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },
    // create a new user
    createUser(req, res) {
      User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },
    // Delete a user and remove them from the course
    deleteUser(req, res) {
      User.findOneAndRemove({ _id: req.params.userId })
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'No such user exists' })
            : Thought.deleteMany(
                { _id: {$in: user.thoughts}}
              )
        )
        .then(() => {
            res.json({message: 'User and associated thoughts deleted'})
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
    updateUser(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId },
            {$set: req.body},
            {runValidators: true, new:true})
            .then(user => {
                if (!user) {
                    return res.status(404).json({message: 'User not found'})
                }
                return res.status(204).json(user)
            })
            .catch((err) => res.status(500).json(err));
    },
    // Add an assignment to a user
    addFriend(req, res) {
    
        User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      )
        .then((user) =>
          !user
            ? res
                .status(404)
                .json({ message: 'No user found with that ID :(' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Remove assignment from a user
    removeFriend(req, res) {
      User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId }},
        { runValidators: true, new: true }
      )
        .then((user) =>
          !user
            ? res
                .status(404)
                .json({ message: 'No user found with that ID :(' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
  };
  