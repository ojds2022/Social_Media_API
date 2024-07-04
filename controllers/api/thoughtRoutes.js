const router = require('express').Router();
const { Thought } = require('../../models');

// get all thoughts
router.get('/', async (req, res) => {
    try {
        const allThoughts = await Thought.find();

        if (!allThoughts) {
            return res.status(404).json({ message: 'Thoughts not found' });
        }

        res.json(allThoughts);
    } catch (error) {
        console.log('Failed to fetch all thoughts', error);
        res.status(500).json(error.message);
    }
});

// get one thought based on its id
router.get('/:thoughtId', async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId });

        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        res.json(thought);
    } catch (error) {
        console.log('Failed to fetch thought', error);
        res.status(500).json(error.message);
    }
});

// create a new thought
router.post('/', async (req, res) => {
    try {
        const newThought = await Thought.create(req.body);
        res.json(newThought);
    } catch (error) {
        console.log('Failed to create a new thought', error);
        res.status(500).json(error.message);
    }
});

// update a thought based on its id
router.put('/:thoughtId', async (req, res) => {
    try {
        const updatedThought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!updatedThought) {
            res.status(404).json({ message: 'Thought not found' });
        }

        res.json(updatedThought);
    } catch (error) {
        console.log('Failed to update thought', error);
        res.status(500).json(error.message);
    }
});

// delete a thought based on its id
router.delete('/:thoughtId', async (req, res) => {
    try {
        const deletedThought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!deletedThought) {
            res.status(404).json({ message: 'Thought not found' });
        }

        await Thought.deleteMany({ _id: { $in: deletedThought.thoughts } });

        res.json({ message: 'Thought successfully deleted!' });
    } catch (error) {
        console.log('Failed to delete thought', error);
        res.status(500).json(error.message);
    }
});

// get all reactions for a single thought
router.get('/:thoughtId/reactions', async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId });

        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        const reactions = thought.reactions;

        res.json(reactions);
    } catch (error) {
        console.log('Failed to fetch reactions', error);
        res.status(500).json(error.message);
    }
});

// create a reaction stored in a single thougt's reactions array field
router.post('/:thoughtId/reactions', async (req, res) => {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;

    try {
        const newReaction = {
            reactionBody,
            username,
            createdAt: new Date()
        };

        const updatedThought = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $push: { reactions: newReaction } },
            { new: true }
        )

        if (!updatedThought) {
            return res.status(404).send({ message: 'Thought not found' });
        }

        res.status(200).send(updatedThought);
    } catch (error) {
        res.status(500).send({ message: 'Error updating thought', error });
    }
});

// clear all reactions for a thought
router.delete('/:thoughtId/reactions', async (req, res) => {
    const { thoughtId } = req.params;

    try {
        const updatedThought = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $set: { reactions: [] } },
            { new: true }
        );

        if (!updatedThought) {
            res.status(404).json({ message: 'Thought not found' });
        }

        res.json({ message: 'Reactions array successfully cleared!', updatedThought });
    } catch (error) {
        console.log('Failed to clear reaction array', error);
        res.status(500).json(error.message);
    }
});

// delete a reaction based on its id
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    const { thoughtId, reactionId } = req.params;

    try {
        const updatedThought = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $pull: { reactions: { _id: reactionId } } },
            { new: true }
        );

        if (!updatedThought) {
            res.status(404).json({ message: 'Thought not found' });
        }

        res.json({ message: 'Reaction successfully deleted!', updatedThought });
    } catch (error) {
        console.log('Failed to delete reaction', error);
        res.status(500).json(error.message);
    }
});

module.exports = router;