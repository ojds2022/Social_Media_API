const express = require('express');
const mongoose = require('mongoose');
const routes = require('./controllers');

const PORT = process.env.PORT || 3000;
const app = express();

const dbURI = 'mongodb://localhost:27017/socialMediaAPI';

mongoose.connect(dbURI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);  // Exit the process with an error code
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);