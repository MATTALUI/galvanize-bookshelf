'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const superSecretKeyDontEvenTryAndStealIt = process.env.SECRET_KEY;

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
router.post('/favorites', function(req,res,next){
  jwt.verify(req.cookies.token, superSecretKeyDontEvenTryAndStealIt, function(err, userInfo){
    let newRow ={
      book_id: req.body.bookId,
      user_id:  userInfo.id
    }
    knex('favorites')
    .insert(newRow)
    .returning(['id','user_id as userId','book_id as bookId'])
    .then(function(createdRow){
      res.send(createdRow[0]);
    });

  });
});
router.delete('/favorites',function(req,res,next){
  jwt.verify(req.cookies.token, superSecretKeyDontEvenTryAndStealIt, function(err, userInfo){
    knex('favorites')
    .del()
    .where('book_id', req.body.bookId)
    .where('user_id', userInfo.id)
    .returning(['book_id as bookId', 'user_id as userId'])
    .then(function(deletedRow){
      res.send(deletedRow[0]);
    });
  });
});






module.exports = router;
