const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const makeStatus = (res, code, message) => {
    return res.status(code).json({message : message});
}

public_users.post("/register", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        return makeStatus(res, 404, "Must provide a username and password.");
    }
    
    if(doesExist(username)){
        return makeStatus(res, 404, `User [${username}] already exists.`);
    }
    
    users.push({"username":username, "password":password});
    return makeStatus(res, 200, `User [${username}] successfully registered. Now you can login.`);
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {

    let getPromise = new Promise((resolve, reject) => {
            let jsonText = JSON.stringify(books, null, 4);
            resolve(jsonText);
    });

    getPromise.then((booksJson) => res.send(booksJson));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    let getPromise = new Promise((resolve, reject) => {
        let isbn = req.params.isbn;
        let book = books[isbn];

        resolve(JSON.stringify(book, null, 4));
    });

  getPromise.then((booksJson) => res.send(booksJson));
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    let getPromise = new Promise((resolve, reject) => {
        let author = req.params.author;
        var filtered = Object.fromEntries(Object.entries(books).filter(([k,v]) => v.author === author));

        resolve(JSON.stringify(filtered, null, 4));
        });

    getPromise.then((booksJson) => res.send(booksJson));
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    let getPromise = new Promise((resolve, reject) => {
        let title = req.params.title;
        var filtered = Object.fromEntries(Object.entries(books).filter(([k,v]) => v.title === title));

        resolve(JSON.stringify(filtered, null, 4));
    });

    getPromise.then((booksJson) => res.send(booksJson));
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
    let getPromise = new Promise((resolve, reject) => {
        let isbn = req.params.isbn;
        let book = books[isbn];

        resolve(JSON.stringify(book.reviews, null, 4));
    });

    getPromise.then((reviewsJson) => res.send(reviewsJson));
});

module.exports.general = public_users;
