const mongoose = require('mongoose');
const User = require('../models/User');

const userData = [
    {
        username: 'johnDoe',
        email: 'jdoe@hotmail.com',
        thoughts: [],
        friends: [],
    },
    {
        username: 'janeDoe',
        email: 'jane@yahoo.com',
        thoughts: [],
        friends: [],
    },
    {
        username: 'kingJames',
        email: 'kingJames@yahoo.com',
        thoughts: [],
        friends: [],
    }
];

const seedUsers = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/socialMediaAPI');

        await User.deleteMany({}); // clear existing users

        const users = await User.insertMany(userData);
        console.log('Users seeded successfully', users);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding users:', error);
        mongoose.connection.close();
    }
}

seedUsers();