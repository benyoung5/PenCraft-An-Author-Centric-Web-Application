// const express = require('express');
// const cors = require('cors');
// const { connect } = require('mongoose');
// require('dotenv').config();

// const userRoutes = require('./routes/userRoutes');
// const postRoutes = require('./routes/postRoutes');
// const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // Changed the path separator to '/'


// const app = express();
// app.use(express.json({ extended: true }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// app.use('/api/users', userRoutes);
// app.use('/api/posts', postRoutes);

// app.use(notFound);
// app.use(errorHandler); 


// connect(process.env.MONGO_URI).then(app.listen(5001, () => console.log(`Server running on
//  port ${process.env.PORT}`))).catch(error => {console.log(error)})


const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const upload  = require("express-fileupload");
const path = require('path');

// Importing route handlers
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

// Importing middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration to allow requests from the front-end
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(upload());
// app.use('/uploads', express.static(__dirname + './uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Error handling middleware
app.use(notFound); // Handles 404 errors
app.use(errorHandler); // Handles application errors

// Database connection and server startup
// const PORT = process.env.PORT || 5001; // Default to 5001 if process.env.PORT is not set
// connect(process.env.MONGO_URI)
//     .then(() => {
//         app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//     })
//     .catch(error => {
//         console.log('Failed to connect to MongoDB:', error);
//     });



connect(process.env.MONGO_URI)
.then(() => {
  app.listen(process.env.PORT || 5001, () => {
    console.log(`Server running on port ${process.env.PORT || 5001}`);
  });
})
.catch((error) => {
  console.log(error);
});



