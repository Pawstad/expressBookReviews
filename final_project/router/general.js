const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper functions that return Promises (simulate async data source)
function getAllBooks() {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject(new Error("No books available"));
    }
  });
}

function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });
}

function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    const matchedBooks = {};
    Object.keys(books).forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchedBooks[key] = books[key];
      }
    });
    if (Object.keys(matchedBooks).length > 0) {
      resolve(matchedBooks);
    } else {
      reject(new Error("No books found by this author"));
    }
  });
}

function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    const matchedBooks = {};
    Object.keys(books).forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchedBooks[key] = books[key];
      }
    });
    if (Object.keys(matchedBooks).length > 0) {
      resolve(matchedBooks);
    } else {
      reject(new Error("No books found with this title"));
    }
  });
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExist = users.some(user => user.username === username);
  if (userExist) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop (async-await)
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get book details based on ISBN (async-await)
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const book = await getBookByISBN(req.params.isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book details based on author (async-await)
public_users.get('/author/:author', async function (req, res) {
  try {
    const matchedBooks = await getBooksByAuthor(req.params.author);
    return res.status(200).json(matchedBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get all books based on title (async-await)
public_users.get('/title/:title', async function (req, res) {
  try {
    const matchedBooks = await getBooksByTitle(req.params.title);
    return res.status(200).json(matchedBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
