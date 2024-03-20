const express = require('express');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connection = require('./dbconnection');

const app = express();
app.use(express.json());
app.use(cors());

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
    const hashedPassword = await bcrypt.hash(password, 10);

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
      const validPassword = await bcrypt.compare(password, user.password);
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
});


// Create a post
app.post('/posts', async (req, res) => {
  try {
    const { post_title, user_id } = req.body;
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


app.listen(process.env.PORT, () => console.log("Backend Started"));