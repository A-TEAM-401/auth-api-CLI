'use strict';

require('dotenv').config();
const inquirer = require('inquirer');
const superagent = require('superagent');
const chalkAnimation = require('chalk-animation');
const figlet = require('figlet');
const gradient = require('gradient-string');
const clear = require('clear');
const apiServer = process.env.SERVER;

const main = async () => {

  try {
    // CLEAR THE CONSOLE
    clear();

    const prompt = inquirer.createPromptModule();

    // TEMPORARY STORAGE
    let noteArr = [];
    let tempNoteArr = [];
    let tempIdArr = [];
    let token = {};

    // MENUS
    const signInArr = ['sign in 🔐', 'sign up 🔏'];
    const crudArr = ['Saved notes 👀', 'Create note 📝 ', 'Update note 🖍', 'Delete note ❌'];

    const updateMenu = [{
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

    const deleteMenu = [{
      type: 'rawlist',
      name: 'del',
      message: 'Select a note to Delete:',
      choices: tempNoteArr,
    }, ]

    const accountQuestions = [{
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
			      mask: '*',			
			      message: 'Enter a password',
			      name: 'pw'
      }
    ]

    const crudMenu = [{
      type: 'rawlist',
      name: 'crud',
      message: gradient.rainbow('Select an option:'),
      choices: crudArr,
    }]

    const enterNote = [{
      name: 'note',
      message: 'Enter your note:',
    }]

    // HELPER FUNCTIONS

    function crudClear() {
      clear();
      figlet('CLI NOTES', function (err, data) {
        if (err) {
          chalkAnimation.neon('Something went wrong...');
          console.dir(err);
          return;
        }
        console.log(gradient.rainbow(data));
        console.log(gradient.rainbow('~=================================================~'));
      });
    }

    function mapNotes(noteArr) {
      noteArr.forEach(noteObj => {
        tempNoteArr.push(noteObj.note);
      });
    }

    function mapNoteIds(noteArr) {
      noteArr.forEach(noteObj => {
        tempIdArr.push(noteObj._id);
      });
    }

    //CRUD PROMPT  

    function crudPrompt() {
      prompt(crudMenu).then(answers => handleCrud(answers)).catch(err => {
        chalkAnimation.neon('oops... something went wrong! 🤷🏽‍♂️', err.message);
        crudPrompt();
      });
    }

    //CRUDHANDLERS

    function handleCrud(selection) {

      crudClear();

      //CREATE

      if (selection.crud === 'Create note 📝 ') {
        crudClear();
        prompt(enterNote)
          .then(answers => {
            const note = answers.note;
            superagent.post(`${apiServer}/notes`)
              .send({
                note
              })
              .set('Authorization', `Bearer ${token}`)
              .then(response => {
                noteArr = response.body.notes;
                const idx = response.body.notes.length - 1;
                tempNoteArr.push(noteArr[idx].note)
                tempIdArr.push(noteArr[idx]._id)
                crudClear();
                chalkAnimation.rainbow('Creating your note', 1);
                setTimeout(() => {
                  crudClear();
                  console.log(gradient.rainbow(('\nCreated your note ✅\n')));
                  crudPrompt();
                }, 4000)
              })
              .catch(err => {
                console.error(err.message);
                crudPrompt();
              })
          })

      }

      //UPDATE

      if (selection.crud === 'Update note 🖍') {
        crudClear();
        prompt(updateMenu)
          .then(answers => {
            const note = answers.newNote;
            const update = answers.update;
            const id = tempIdArr[tempNoteArr.indexOf(update)];
            superagent.put(`${apiServer}/notes/${id}`)
              .send({
                note
              })
              .set('Authorization', `Bearer ${token}`)
              .then(() => {
                tempNoteArr.splice(tempNoteArr.indexOf(update), 1, note)
                setTimeout(() => {
                  crudClear();
                  chalkAnimation.rainbow('updating your note', 1), 2000
                });
                setTimeout(() => {
                  crudClear();
                  console.log(gradient.rainbow(('\nUpdated your note ✅\n')));
                  crudPrompt();
                }, 4000)
              })
              .catch(err => {
                console.error(err.message);
                crudPrompt();
              })
          })
      }

      // DELETE
      if (selection.crud === 'Delete note ❌') {
        crudClear();
        prompt(deleteMenu)
          .then(answers => {
            const del = answers.del;
            const id = tempIdArr[tempNoteArr.indexOf(del)];
            superagent.delete(`${apiServer}/notes/${id}`)
              .set('Authorization', `Bearer ${token}`)
              .then(response => {
                noteArr = response.body.notes;
                tempIdArr.splice(tempNoteArr.indexOf(del), 1);
                tempNoteArr.splice(tempNoteArr.indexOf(del), 1);
                crudClear();
                chalkAnimation.rainbow('deleting your note', .5);
                setTimeout(() => {
                  crudClear();
                  console.log(gradient.rainbow(('\nDeleted your note ✅\n')));
                  crudPrompt();
                }, 4000);
              })
              .catch(err => {
                crudClear();
                console.error(err.message);
                crudPrompt();
              })
          })
          .catch(err => {
            crudClear();
            console.error(err.message);
            crudPrompt();
          })
      }

      // READ
      if (selection.crud === 'Saved notes 👀') {
        crudClear();
        superagent.get(`${apiServer}/notes`).set('Authorization', `Bearer ${token}`)
          .then(response => {
            console.log(`\n`, response.body.map(item => item.note), `\n`);
            console.log(gradient.rainbow('~=================================================~'));
            crudPrompt();
          }).catch(err => console.error(err.message));
      }

    };

    // AUTH
    function auth() {

      prompt(accountQuestions)
        .then(answers => {
          const inOrOn = answers.inOrOn;
          const username = answers.username;
          const password = answers.pw;
          const hasAccount = (inOrOn === 'sign in 🔐');
          !hasAccount ? signup(username, password) : signIn(username, password);
        })
        .catch(err => console.error(err.message));

      //SIGNIN
      const signIn = async (username, password) => {
        try {
          const response = await superagent.post(`${apiServer}/signin`).auth(username, password);
          token = response.body.token;
          crudClear();
          welcomeUser(response);
          if (response.body.user.notes) {
            noteArr = response.body.user.notes;
            mapNotes(noteArr);
            mapNoteIds(noteArr);
          }
        } catch (err) {
          crudClear();
          console.log(err.message);
          auth();
        }
      }

      //SIGNUP
      const signup = async (username, password) => {
        try {
          const response = await superagent.post(`${apiServer}/signup`).send({
            username,
            password
          })
          token = response.body.token;
          crudClear();
          console.log(gradient.rainbow('Account created! ✅'));
          auth();
        } catch (err) {
          crudClear();
          console.error(err.message);
          auth();
        }
      }

    };

    // GREETINGS AND ANIMATIONS

    let str = 'Loading...';
    const rainbow = chalkAnimation.rainbow(str, .5);

    figlet(str, function (err, data) {
      if (err) {
        chalkAnimation.neon('Something went wrong...');
        console.dir(err);
        return;
      }
      rainbow.replace(data, .5);
    });

    const interval = setInterval(() => {
      str += '.';
      figlet(str, function (err, data) {
        if (err) {
          chalkAnimation.neon('Something went wrong...');
          console.dir(err);
          return;
        }
        rainbow.replace(data, .5);
      });
    }, 5000);

    setTimeout(() => {

      figlet('CLI NOTES', function (err, data) {

        if (err) {
          chalkAnimation.neon('Something went wrong...');
          console.dir(err);
          return;
        }
        clearInterval(interval);
        rainbow.replace(data, .5);
      });
    }, 5000);

    setTimeout(() => {
      rainbow.stop();
      auth();
    }, 10000);

    // AUTH USER GREETING  
    function welcomeUser(response) {
      figlet(`Welcome, ${response.body.user.username}!`, function (err, data) {
        if (err) {
          chalkAnimation.neon('Something went wrong...');
          console.dir(err);
          return;
        }
        rainbow.replace(data, .5);
        rainbow.start();
        setTimeout(() => {
          rainbow.stop();
          crudPrompt();
        }, 3000)
      })
    }


  } catch (err) {
    console.log(err.message)
  }

}

main();