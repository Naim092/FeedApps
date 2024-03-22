const express = require('express');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connection = require('./dbconnection');

const app = express();
app.use(express.json());
app.use(cors());


process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // Exit with failure
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1); // Exit with failure
});

// Register
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    
    const usernameCheckQuery = 'SELECT * FROM users WHERE username = ?';
    const emailCheckQuery = 'SELECT * FROM users WHERE email = ?';
    const [usernameResults] = await connection.promise().execute(usernameCheckQuery, [username]);
    const [emailResults] = await connection.promise().execute(emailCheckQuery, [email]);
    
    if (usernameResults.length > 0) {
      return res.status(400).send({ message: "Username already exists" });
    }

    if (emailResults.length > 0) {
      return res.status(400).send({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hashSync(password, 10);

    const insertQuery = 'INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)';
    await connection.promise().execute(insertQuery, [username, hashedPassword, email, phone]);
    
    res.status(201).send({ message: "Registered successfully!" });
  } catch (error) {
    console.error("An error occurred: ", error);
    res.status(500).send({ message: "An error occurred" });
  }
});




// Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = ?;`;
    const [users] = await connection.promise().execute(query, [username]);
    
    if (users.length > 0) {
      const user = users[0];
      const validPassword = await bcrypt.compareSync(password, user.password); // Fix the typo here
      if (validPassword) {
        res.status(200).send({ message: "Login Successful!" });
      } else {
        res.status(401).send({ message: "Invalid username or password" });
      }
    } else {
      res.status(401).send({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("An error occurred: ", error);
    res.status(500).send({ message: "An error occurred" });
  }
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // Exit with failure
  });
  
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1); // Exit with failure
  });
  
});


// Define isAdmin middleware function
function isAdmin(req, res, next) {
  // Implement logic to check if the user is an admin
  // For example, you can check if the user's role is 'admin'
  if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
  }
  next();
}



// Admin panel routes
// Approve a user
app.put('/admin/users/approve/:id', isAdmin, async (req, res) => {
  try {
      const userId = req.params.id;
      // Update the user in the database to mark them as approved
      const updateQuery = 'UPDATE users SET approved = true WHERE id = ?';
      await connection.promise().execute(updateQuery, [userId]);
      res.status(200).json({ message: "User approved successfully" });
  } catch (error) {
      console.error("An error occurred: ", error);
      res.status(500).json({ message: "An error occurred" });
  }
});

// Delete a user
app.delete('/admin/users/:id', isAdmin, async (req, res) => {
  try {
      const userId = req.params.id;
      // Delete the user from the database
      const deleteQuery = 'DELETE FROM users WHERE id = ?';
      await connection.promise().execute(deleteQuery, [userId]);
      res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
      console.error("An error occurred: ", error);
      res.status(500).json({ message: "An error occurred" });
  }
});



// Create a post
app.post('/posts', async (req, res) => {
  try {
    const { post_title } = req.body;
    // Obtain user_id from the authenticated user (you need to implement this)
    const user_id = req.user_id; // Assuming you have stored user_id in req object after authentication
    if (!user_id) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const query = 'INSERT INTO feeds(post_title, user_id) VALUES (?, ?);';
    const [result] = await connection.promise().execute(query, [post_title, user_id]);
    
    if (result.affectedRows > 0) {
      res.status(200).send({ message: "Post created!" });
    } else {
      res.status(400).send({ message: "Error creating post" });
    }
  } catch (error) {
    console.error("An error occurred.", error);
    res.status(500).send({ message: "An error occurred" });
  }
});



app.get('/posts', async (req, res) => {
  try {
    const query = 'SELECT feeds.id, feeds.post_title, feeds.date, users.username FROM feeds INNER JOIN users ON feeds.user_id = users.id';
    const [posts] = await connection.promise().execute(query);

    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: 'No posts found' });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});
const PORT = 3001; // Change the port number
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




// app.listen(process.env.PORT, () => console.log("Backend Started"));