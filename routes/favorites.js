'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const superSecretKeyDontEvenTryAndStealIt = 'superSecretKeyDontEvenTryAndStealIt';//process.env.SECRET_KEY;

router.use('/favorites', function(req, res, next){
  if(req.cookies.token){
    jwt.verify(req.cookies.token,superSecretKeyDontEvenTryAndStealIt, function(err, decoded){
      if(decoded){
        next();
      }else{
        res.sendStatus(401);
      }
    });
  }else{
    res.sendStatus(401);
  }
});
router.get('/favorites', function(req,res,next){
  jwt.verify(req.cookies.token, superSecretKeyDontEvenTryAndStealIt, function(err, userInfo){
    knex.select(['book_id as bookId','author','cover_url as coverUrl','description','genre','favorites.id','title', 'books.created_at as createdAt','books.updated_at as updatedAt','user_id as userId'])
    .from('favorites')
    .join('books', 'book_id','=','books.id')
    .then(function(favorites){
      res.send(favorites);
    });
  });
});
router.get('/favorites/:check', function(req,res,next){
  jwt.verify(req.cookies.token, superSecretKeyDontEvenTryAndStealIt, function(err, userInfo){
    knex
    .select('*')
    .from('favorites')
    .where('favorites.user_id', userInfo.id)
    .where('favorites.book_id', req.query.bookId)
    .then(function(favorites){
      if(favorites.length){
        res.send(true);
      }else{
        res.send(false);
      }
    });





  });
});
router.post('favorites', function(req,res,next){
  console.log('post');
  res.send({});
});
router.delete('')






module.exports = router;
