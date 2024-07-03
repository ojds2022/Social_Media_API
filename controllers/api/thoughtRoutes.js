const router = require('express').Router();
const { User, Thought } = require('../../models');

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
        const thought = await User.findOne({ _id: req.params.thoughtId });

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

module.exports = router;