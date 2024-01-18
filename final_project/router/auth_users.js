const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
//const uuidv4 = require('uuid');
const regd_users = express.Router();

let users = [{"username":"yousuf","password":"123"}];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
      });
    
      if (userswithsamename.length > 0) {
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
      });
    
      if (validusers.length > 0) {
        return true;
      } else {
        return false;
      }
}

regd_users.post("/register", (req, res) => {
     const username = req.params.username;
    const password = req.params.password;

  if (!username && !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Login successful" });
  }
  else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  });
//Task 7
//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Error logging in. Please provide both username and password" });
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          data: password
        },
        'access',
        { expiresIn: 60 * 60 * 60}
      );
  
      req.session.authorization = {
        accessToken,
        username
      };
  
      return res.status(200).json({ message: "User successfully logged in" });
    } else {
      res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

//Task 8
// Adding or Modifying a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { username } = req.session.authorization;
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `book with ISBN ${isbn} not found` });
  } else {
    // use 'reviews' keyword in the body while making a request
    const { reviews } = req.body;
    if (!reviews) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "please provide  reviews" });
    }
    book.reviews[username] = reviews;
    res
      .status(StatusCodes.CREATED)
      .json({ msg: `review added successfully for user ${username}`, book });
  }
});

//Task 9
//deleting a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.body.isbn;
    const username = req.session.authorization.username;

    if (books[isbn]) {
      let book = books[isbn];
      delete book.reviews[username];
      return res.status(200).send(`Reviews for the book with ISBN ${isbn} posted by the user ${username} is deleted.`);
    } else {
      return res.status(404).json({ message: `ISBN ${isbn} not found` });
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
