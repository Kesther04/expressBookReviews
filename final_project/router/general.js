const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    return users.some((user) => user.username === username);
};

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // code for getting book list data
    res.send(JSON.stringify(books,null,10))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // code for getting book based on ISBN
    const isbn = req.params.isbn;
    res.send(books[isbn]);

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // code for getting book based on author
    const targetAuthor = req.params.author.trim().toLowerCase();

    // Find all matching books regardless of letter case or leading/trailing whitespace
    const matchingBooks = Object.values(books).filter(
      book => book.author.trim().toLowerCase() === targetAuthor
    );
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    }
    return res.status(404).json({ message: "Author not found" });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //code for getting book based on title
    const targetTitle = req.params.title.trim().toLowerCase();

    // Find all matching books regardless of letter case or leading/trailing whitespace
    const matchingBooks = Object.values(books).filter(
      book => book.title.trim().toLowerCase() === targetTitle
    );
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    }
    return res.status(404).json({ message: "Title not found" });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // code for getting book based on ISBN
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
