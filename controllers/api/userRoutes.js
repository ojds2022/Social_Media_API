const router = require('express').Router();
const { User, Thought } = require('../../models');

// get all users
router.get('/', async (req, res) => {
    try {
        const allUsers = await User.find();

        if (!allUsers) {
            return res.status(404).json({ message: 'Users not found' });
        }

        res.json(allUsers);
    } catch (error) {
        console.log('Failed to fetch all users', error);
        res.status(500).json(error.message);
    }
});

// get one user based on their id
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.log('Failed to fetch user', error);
        res.status(500).json(error.message);
    }
});

// create a new user
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } catch (error) {
        console.log('Failed to create a new user', error);
        res.status(500).json(error.message);
    }
});

// update a user based on their id
router.put('/:userId', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.log('Failed to update user', error);
        res.status(500).json(error.message);
    }
});

// delete a user based on their id
router.delete('/:userId', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ _id: req.params.userId });

        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
        }

        await Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });

        res.json({ message: 'User and thoughts successfully deleted!' });
    } catch (error) {
        console.log('Failed to delete user', error);
        res.status(500).json(error.message);
    }
});

// add a friend to frined list
router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId }},
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.log('Failed to add friend', error);
        res.status(500).json(error.message);
    }
});

// delete a friend from friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.log('Failed to remove friend', error);
        res.status(500).json(error.message);
    }
});

module.exports = router;
