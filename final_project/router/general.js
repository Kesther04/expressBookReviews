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
// public_users.get('/',function (req, res) {
//     // code for getting book list data
//     res.send(JSON.stringify(books,null,10))
// });

// Task 10: Get the book list available in the shop using Async/Await & Promises
public_users.get('/', async function (req, res) {
    try {
        // Wrap the book retrieval in a Promise to simulate asynchronous database lookup
        const fetchBooks = new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject("Unable to retrieve book database");
            }
        });

        // Await the promise resolution
        const bookList = await fetchBooks;
        return res.status(200).send(JSON.stringify(bookList, null, 10));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list", error });
    }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//     // code for getting book based on ISBN
//     const isbn = req.params.isbn;
//     res.send(books[isbn]);

// });

// Task 11: Get book details based on ISBN using Async/Await & Promises
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        // Wrap book lookup in a Promise to simulate an asynchronous operation
        const getBookByISBN = new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(`Book with ISBN ${isbn} not found.`);
            }
        });

        // Await the promise resolution
        const bookDetails = await getBookByISBN;
        return res.status(200).json(bookDetails);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//     // code for getting book based on author
//     const targetAuthor = req.params.author.trim().toLowerCase();

//     // Find all matching books regardless of letter case or leading/trailing whitespace
//     const matchingBooks = Object.values(books).filter(
//       book => book.author.trim().toLowerCase() === targetAuthor
//     );
  
//     if (matchingBooks.length > 0) {
//       return res.status(200).json(matchingBooks);
//     }
//     return res.status(404).json({ message: "Author not found" });
// });

// Task 12: Get book details based on Author using Async/Await & Promises
public_users.get('/author/:author', async function (req, res) {
    const targetAuthor = req.params.author.trim().toLowerCase();

    try {
        // Wrap author lookup in a Promise to simulate asynchronous processing
        const getBooksByAuthor = new Promise((resolve, reject) => {
            const matchingBooks = Object.values(books).filter(
                book => book.author.trim().toLowerCase() === targetAuthor
            );

            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject("Author not found");
            }
        });

        // Await the promise resolution
        const booksList = await getBooksByAuthor;
        return res.status(200).json(booksList);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     //code for getting book based on title
//     const targetTitle = req.params.title.trim().toLowerCase();

//     // Find all matching books regardless of letter case or leading/trailing whitespace
//     const matchingBooks = Object.values(books).filter(
//       book => book.title.trim().toLowerCase() === targetTitle
//     );
  
//     if (matchingBooks.length > 0) {
//       return res.status(200).json(matchingBooks);
//     }
//     return res.status(404).json({ message: "Title not found" });
// });

// Task 13: Get book details based on Title using Async/Await & Promises

public_users.get('/title/:title', async function (req, res) {
    const targetTitle = req.params.title.trim().toLowerCase();

    try {
        // Wrap title lookup in a Promise to simulate asynchronous processing
        const getBooksByTitle = new Promise((resolve, reject) => {
            const matchingBooks = Object.values(books).filter(
                book => book.title.trim().toLowerCase() === targetTitle
            );

            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject("Title not found");
            }
        });

        // Await the promise resolution
        const booksList = await getBooksByTitle;
        return res.status(200).json(booksList);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // code for getting book based on ISBN
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
