const { User, Thought } = require('../models');
module.exports = {
    // Get all Users
    getThoughts(req, res) {
      Thought.find()
        .then( (thoughts) => {
          
          return res.json(thoughts);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },
    // Get a single thought
    getSingleThought(req, res) {
      Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then(async (thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : res.json({
                thought,
                
              })
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },
    // create a new thought
    createThought(req, res) {console.log(req.body);
      Thought.create(req.body)
        .then((thought) => {console.log();
            return User.findOneAndUpdate({username: req.body.username},
                {$push: {thoughts: thought._id}},
                {new: true}).populate('thoughts')
        }).then(user => res.json(user))
        .catch((err) => res.status(500).json(err));
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate({_id: req.params.thoughtId},
            {$set: req.body},
            {runValidators: true, new:true})
            .then(thought => {
                if (!thought) {
                    return res.status(404).json({message: 'Thought not found'})
                }
                return res.status(200).json(thought)
            })
            .catch((err) => res.status(500).json(err));
    },
    // Delete a thought and remove them from the course
    deleteThought(req, res) {
      Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: 'No such thought exists' })
            : User.findOneAndUpdate({username: thought.username}, 
                {$pull: {thoughts: req.params.thoughtId}},
                {new: true})
        )
        .then((user) => {
            if (!user) {res.status(404).json({ message: 'Thought deleted but no user found with this Id'})}
            return res.json({message: 'Thought succesfully deleted'})
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
  
    // Add an assignment to a thought
    addReaction(req, res) {
    
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body} },
        { runValidators: true, new: true }
      )
        .then((thought) =>
          !thought
            ? res
                .status(404)
                .json({ message: 'No thought found with that ID :(' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Remove assignment from a thought
    removeReaction(req, res) {
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: {reactionId: req.params.reactionId} }},
        { runValidators: true, new: true }
      )
        .then((thought) =>
          !thought
            ? res
                .status(404)
                .json({ message: 'No thought found with that ID :(' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
  };
  