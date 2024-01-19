const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
//const axios = require("axios").default;

//Task 6
//registering user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer with same username already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register customer."});
});

// Task 1
// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

//Task 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  res.send(books[isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//Task 3
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let authors = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){
                authors.push(books[key]);
            }
        }
    }
    if(authors.length == 0){
        return res.status(300).json({message: "Author not found"});
    }
    res.send(authors);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//task 4
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let titles = []
  for(const [key, values] of Object.entries(books)){
      const book = Object.entries(values);
      for(let i = 0; i < book.length ; i++){
          if(book[i][0] == 'title' && book[i][1] == req.params.title){
              titles.push(books[key]);
          }
      }
  }
  if(titles.length == 0){
      return res.status(300).json({message: "Title not found"});
  }
  res.send(titles);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//Task 5
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  res.send(books[isbn].reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//Task 10
// Get books using promise
public_users.get('/books',function (req, res) {

  const get_books = new Promise((resolve, reject) => {
      resolve(res.send(JSON.stringify({books}, null, 4)));
    });

    get_books.then(() => console.log("Promise for Task 10 resolved"));

});
  
//Task 11
//Get books based on isbn using promise
public_users.get('/books/isbn/:isbn',function (req, res) {
  const get_books_isbn = new Promise((resolve, reject) => {
  const isbn = req.params.isbn;
  // console.log(isbn);
      if (req.params.isbn <= 10) {
      resolve(res.send(books[isbn]));
      }else {
          reject(res.send('ISBN not found'));
      }
  });
  get_books_isbn.then(function(){
          console.log("Promise for Task 11 is resolved");
  }).
      catch(function () { 
              console.log('ISBN not found');
});

});

//Task 12
//Get book details based on Author using promise
public_users.get('/books/author/:author',function (req, res) {    
  const get_author = new Promise((resolve, reject) => {    
    let booksbyauthor = [];        
    let isbns = Object.keys(books);      
    isbns.forEach((isbn) => {        
      if(books[isbn]["author"] === req.params.author) {        
        booksbyauthor.push({"isbn":isbn, 
        "author":books[isbn]["author"],        
        "title":books[isbn]["title"],         
        "reviews":books[isbn]["reviews"]});          
      }        
    });         
    res.send(JSON.stringify({booksbyauthor}, null, 4));               
  });               
  
  get_author.then(function(){
    console.log("Promise for Task 12 is resolved");
}).
catch(function () { 
        console.log('Author not found');
});            
});  

//Task 13
//Get book details based on title using promise
public_users.get('/books/title/:title',function (req, res) {    
  const get_title = new Promise((resolve, reject) => {    
    let booksbytitle = [];        
    let isbns = Object.keys(books);      
    isbns.forEach((isbn) => {        
      if(books[isbn]["title"] === req.params.title) {        
        booksbytitle.push({"isbn":isbn,        
        "author":books[isbn]["author"], 
        "title":books[isbn]["title"],        
        "reviews":books[isbn]["reviews"]});          
      }        
    });         
    res.send(JSON.stringify({booksbytitle}, null, 4));               
  });               
  
  get_title.then(function(){
    console.log("Promise for Task 13 is resolved");
}).
catch(function () { 
        console.log('title not found');
});            
});  
  
module.exports.general = public_users;
