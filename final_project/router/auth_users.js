const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

//returns true if the user and password matches the users in our system.
const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "You must specify a username and password."});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
      }
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.body.username;
    let reviewText = req.body.reviewText;

    let book = books[isbn];
    if(!book){
        return res.status(404).json({message: `Book isbn[{isbn}] not found.`});
    }

    if(!Array.isArray(book.reviews)){
        book.reviews = [];
    }
    // Remove the existing review if it exists.
    book.reviews = book.reviews.filter((rev) => rev.username != username);

    let review = {};
    review.username = username;
    review.reviewText = reviewText;
    book.reviews.push(review);

    books[isbn] = book;

    return res.status(200).json({message: "Review successfully added."});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.body.username;
    let reviewText = req.body.reviewText;

    let book = books[isbn];
    if(!book){
        return res.status(404).json({message: `Book isbn[{isbn}] not found.`});
    }

    if(!Array.isArray(book.reviews)){
        book.reviews = [];
    }
    // Remove the existing review if it exists.
    book.reviews = book.reviews.filter((rev) => rev.username != username);

    books[isbn] = book;

    return res.status(200).json({message: "Review successfully deleted."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.doesExist = doesExist;
module.exports.users = users;
