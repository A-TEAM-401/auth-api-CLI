'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('../models/users.js');
const basicAuth = require('../middleware/basic.js')
const bearerAuth = require('../middleware/bearer.js')
const Note = require('../models/notes.js');
const { response } = require('express');
const noteSchema = require('../models/notes.js');

authRouter.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch(err) {
    next(err.message)
  }
});

let username = '';

authRouter.post('/signin', basicAuth, (req, res, next) => {
  try {
    const user = {
      user: req.user,
      token: req.user.token
    };
    username = req.user.username;
    res.status(200).json(user);
 } catch(err) {
    throw new Error(err.message);
 }
});

authRouter.get('/users', bearerAuth, async (req, res, next) => {
  try {
    const users = await User.find({});
    const list = users.map(user => user.username);
    res.status(200).json(list);
  } catch(err) {
    throw new Error(err.message);
  }
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  try {
    res.status(200).send('Welcome to the secret area')
  } catch(err) {
    throw new Error(err.message);
  }
});

authRouter.post('/notes', bearerAuth, async (req, res, next) => {
  try {
    const note = { note: req.body.note };
    await User.findOne({ username }, function(err, entry){
      if(err){
        throw new Error(err.message);
      } else {
        entry.notes.push(note);
        entry.save();
        res.status(201).json(entry);
      }
    });
  } catch(err) {
    next(err.message);
  }
});

authRouter.get('/notes/:id', bearerAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    await User.findOne({ username }, function(err, entry){
      if(err){
        throw new Error(err.message);
      } else {
        entry.notes.forEach(note => {
          if(note._id == id){
            res.status(200).json(note);
          }
        })
      }
    });
  } catch(err) {
    next(err.message);
  }
});

authRouter.get('/notes', bearerAuth, async (req, res, next) => {
  try {
    await User.findOne({ username }, function(err, entry){
      if(err){
        throw new Error(err.message);
      } else {
        res.status(200).json(entry.notes);
      }
    });
  } catch(err) {
    next(err.message);
  }
});

authRouter.put('/notes/:id', bearerAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const newNote = { note: req.body.note };
    await User.findOne({ username }, function(err, entry){
      if(err){
        throw new Error(err.message);
      } else {
        entry.notes.forEach(note => {
          if(note._id == id){
              const noteIdx = entry.notes.indexOf(note);
              entry.notes.splice(noteIdx, 1, newNote);
              entry.save(); 
            res.status(200).json(entry);
          }
        })
      }
    });
  } catch(err) {
    next(err.message);
  }
});

authRouter.delete('/notes/:id', bearerAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    // const newNote = { note: req.body };
    await User.findOne({ username }, function(err, entry){
      if(err){
        throw new Error(err.message);
      } else {
        entry.notes.forEach(note => {
          if(note._id == id){
              const noteIdx = entry.notes.indexOf(note);
              entry.notes.splice(noteIdx, 1);
              entry.save(); 
            res.status(200).json(entry);
          }
        })
      }
    });
  } catch(err) {
    next(err.message);
  }
});

module.exports = authRouter;