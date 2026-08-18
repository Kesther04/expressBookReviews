const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //code to check if username and password match the one we have in records.

    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
    
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    
    // Get review from query parameter or request body
    const review = req.query.review || req.body.review;
    const username = req.session.authorization ? req.session.authorization['username'] : null;

    if (!username) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    if (books[isbn]) {
        // Add or update the review under the user's username key
        books[isbn].reviews[username] = review;
        return res.status(200).json({
        message: `The review for the book with ISBN ${isbn} has been updated`,
        reviews: books[isbn].reviews
        });
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization ? req.session.authorization['username'] : null;
  
    if (!username) {
      return res.status(403).json({ message: "User not authenticated" });
    }
  
    if (books[isbn]) {
      let reviews = books[isbn].reviews;
      if (reviews[username]) {
        delete reviews[username];
        return res.status(200).json({ 
          message: `Reviews for the ISBN ${isbn} posted by the user ${username} deleted.` 
        });
      } else {
        return res.status(404).json({ message: "No review found for this user on this book." });
      }
    } else {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
