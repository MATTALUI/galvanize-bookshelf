'use strict';
const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');

// YOUR CODE HERE
router.get('/books', function(req, res){
  knex('books')
  .orderBy('title')
  .then(function(info){
    res.send(humps.camelizeKeys(info));
  });
});
router.get('/books/:id', function(req, res){
  knex('books')
  .where('id', req.params.id)
  .first()
  .then(function(info){
    res.send(humps.camelizeKeys(info));
  })
});
router.post('/books', function(req, res){
  knex.raw('SELECT setval(\'books_id_seq\', (SELECT MAX(id) FROM books));');
  let data = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl
  };
  knex('books')
  .insert(data)
  .returning('*')
  .then(function(info){
    res.send(humps.camelizeKeys(info[0]));
  });
});
router.patch('/books/:id', function(req, res, next){
  console.log('patched');
  res.send();
});

module.exports = router;
