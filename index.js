'use strict';

require('dotenv').config();
const inquirer = require('inquirer');
const superagent = require('superagent');
const cors = require('cors');

// Start up DB Server
const mongoose = require('mongoose');
const server = require('./src/server.js');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, options);
// Start the web server
require('./src/server.js').start(process.env.PORT);

let token = {};

const prompt = inquirer.createPromptModule();

const signInArr = ['sign in 🔐', 'sign up 🔏'];

const crudArr = ['Saved notes 👀', 'Create note 📝 ', 'Update note 🖍', 'Delete note ❌'];

let noteArr = [];
let tempNoteArr = [];
let tempIdArr = [];

function mapNotes(noteArr){
  noteArr.forEach(noteObj => {
    tempNoteArr.push(noteObj.note);
  });
}

function mapNoteIds(noteArr){
  noteArr.forEach(noteObj => {
    tempIdArr.push(noteObj._id);
  });
}  

const updateMenu = [
  {
    type: 'rawlist',
    name: 'update',
    message: 'Select a note to update:',
    choices: tempNoteArr,
  },
  {
    name: 'newNote',
    message: 'Update note:'
  }
]

const deleteMenu = [
  {
    type: 'rawlist',
    name: 'del',
    message: 'Select a note to Delete:',
    choices: tempNoteArr,
  },
]

const accountQuestions = [
  {
    type: 'rawlist',
    name: 'inOrOn',
    message: 'Sign in or create a new account:',
    choices: signInArr,
  },
  {
    name: 'username',
    message: 'Enter your username:',
  },
  {
    type: 'password',
    name: 'pw',
    message:'Enter your password:',
  },
]

const crudMenu = [
  {
    type: 'rawlist',
    name: 'crud',
    message: 'Select an option:',
    choices: crudArr,
  },
]

const enterNote = [
  {
    name: 'note',
    message: 'Enter your note:',
  },
]

console.log('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩')
console.log('🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦')
console.log('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩')
console.log('🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦')
console.log('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩')
console.log('🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦')
console.log('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩')
console.log('🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦')
console.log('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩')
console.log('🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦')
console.log('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩')
console.log('🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦')
console.log('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩')
console.log('🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦')
console.log('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩')
console.log('🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦')
console.log('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩')
console.log('🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦')
console.log('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩')
console.log('🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦')
console.log('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩\n')

prompt(accountQuestions)
  .then(answers => {
    const inOrOn = answers.inOrOn;
    const username = answers.username;
    const password = answers.pw;
    if(inOrOn === 'sign in 🔐'){
      superagent.post('http://localhost:3333/signin')
      .auth(username, password)
      .then(response => {
        token = response.body.token;
        if(response.body.user.notes){
          noteArr = response.body.user.notes;
          mapNotes(noteArr);
          mapNoteIds(noteArr);
          console.log(`\n✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`);
          console.log(` ✨✨✨✨✨✨✨✨✨✨✨✨ Welcome, ${response.body.user.username}! ✨✨✨✨✨✨✨✨✨✨✨✨✨`);
          console.log(`✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨\n`);
          crudPrompt();
        } else {
          console.log(`\n✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`);
          console.log(` ✨✨✨✨✨✨✨✨✨✨✨✨ Welcome, ${response.body.user.username}! ✨✨✨✨✨✨✨✨✨✨✨✨✨`);
          console.log(`✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨\n`);
          crudPrompt();
        }
      })
      .catch(err => console.log(err.message));
    } else if(inOrOn === 'sign up 🔏'){
      superagent.post('http://localhost:3333/signup')
      .send({ username, password })
      .then(() => {
        console.log('Account created! ✅')
      })
      .then(() => {
        superagent.post('http://localhost:3333/signin')
        .auth(username, password)
        .then(response2 => {
          token = response2.body.token;
          console.log(`\n✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`);
          console.log(` ✨✨✨✨✨✨✨✨✨✨✨✨ Welcome, ${response2.body.user.username}! ✨✨✨✨✨✨✨✨✨✨✨✨✨`);
          console.log(`✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨\n`);
            crudPrompt();
        })
        .catch(err => console.log(err.message));
      })
      .catch(err => console.log(err.message));
    }
  });

  function crudPrompt(){
    prompt(crudMenu).then(answers => handleCrud(answers)).catch(err => {
      console.log('oops... something went wrong! 🤷🏽‍♂️');
      crudPrompt();
    });
  }

  function handleCrud(selection){
    if(selection.crud === 'Create note 📝 '){
      prompt(enterNote)
      .then(answers => {
        const note = answers.note;
        superagent.post('http://localhost:3333/notes')
        .send({ note })
        .set('Authorization', `Bearer ${token}`)
        .then(response => {
          noteArr = response.body.notes;
          const idx = response.body.notes.length - 1;
          tempNoteArr.push(noteArr[idx].note)
          tempIdArr.push(noteArr[idx]._id)
          console.log('\nNote created successfully ✅\n');
          crudPrompt();
        })
        .catch(err => {
          console.error(err.message);
        })
      })
    }

    if(selection.crud === 'Saved notes 👀'){
        superagent.get('http://localhost:3333/notes')
        .set('Authorization', `Bearer ${token}`)
        .then(response => {
          console.log('\n⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️')
          console.log('⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️ My Notes ⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️')
          console.log('⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️\n')
          tempNoteArr.forEach(note => console.log(note));
          console.log('\n⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️')
          console.log('⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️')
          console.log('⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️\n')
          crudPrompt();
        })
        .catch(err => {
          console.error(err.message);
        })
    }

    if(selection.crud === 'Update note 🖍'){
      prompt(updateMenu)
        .then(answers => {
          const note = answers.newNote;
          const update = answers.update;
          const id = tempIdArr[tempNoteArr.indexOf(update)];
          superagent.put(`http://localhost:3333/notes/${id}`)
          .send({note})
          .set('Authorization', `Bearer ${token}`)
          .then(response => {
            tempNoteArr.splice(tempNoteArr.indexOf(update), 1, note)
            console.log('\nUpdated your note ✅\n');
            crudPrompt();
          })
          .catch(err => {
            console.error(err.message);
          })
        })
    }

    if(selection.crud === 'Delete note ❌'){
      prompt(deleteMenu)
        .then(answers => {
          const del = answers.del;
          const id = tempIdArr[tempNoteArr.indexOf(del)];
          superagent.delete(`http://localhost:3333/notes/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .then(response => {
            noteArr = response.body.notes;
            // mapNotes(noteArr);
            // mapNoteIds(noteArr);
            tempIdArr.splice(tempNoteArr.indexOf(del), 1);
            tempNoteArr.splice(tempNoteArr.indexOf(del), 1);
            console.log('\nDeleted your note ✅\n');
            crudPrompt();
          })
          .catch(err => {
            console.error(err.message);
          })
        })
    }

  };