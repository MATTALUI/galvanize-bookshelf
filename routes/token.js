'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const superSecretKeyDontEvenTryAndStealIt = process.env.SECRET_KEY;

router.get('/token', function(req,res){
  if(Object.keys(req.cookies).length > 0){
    res.send(true);
  }else{
    res.send(false);
  }
});
router.post('/token', function(req, res){
  if(!req.body){
    res.send();
  }else{
    knex
    .select('id', 'email', 'first_name as firstName', 'last_name as lastName', 'hashed_password as hash')
    .from('users')
    .where('email', req.body.email)
    .first()
    .then(function(userInfo){
      if (!userInfo){
        res.set('Content-Type', 'text/plain');
        res.status(400).send('Bad email or password');
      }else{
        bcrypt.compare(req.body.password, userInfo.hash, function(err, hashRes){
          if (hashRes){
            let response = {
              email: userInfo.email,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              id: userInfo.id
            }
            let token = jwt.sign(response, superSecretKeyDontEvenTryAndStealIt);
            res.cookie('token', token, {httpOnly:true});
            res.send(response);
          }else{
            res.set('Content-Type', 'text/plain');
            res.status(400).send('Bad email or password');
          }
        })
      }
    });
  }
});
router.delete('/token', function(req, res){
  res.cookie('token','');
  res.send(true);
});

module.exports = router;
