'use strict';

process.env.SECRET = "toes";
const { server } = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
require('@code-fellows/supergoose');
const Users = require('../src/models/users.js');
const mockRequest = supergoose(server);

let users = {
  admin: { username: 'admin', password: 'password', notes:[], role: 'admin' },
  editor: { username: 'editor', password: 'password', notes:[], role: 'editor' },
  writer: { username: 'writer', password: 'password', notes:[], role: 'writer' },  
  user: { username: 'user', password: 'password', notes: [], role: 'user' },
};

// Pre-load our database with fake users
beforeAll(async (done) => {
  await new Users(users.admin).save();
  done();
});

describe('Routes', () => {
  it('should post a new note', async() => {
    const responseToken = await mockRequest.post('/signin').auth('admin', 'password');
    const token = responseToken.body.token;
    let obj = { note: 'test_note_1' };
    let expected = { note: 'test_note_1'};

    const response = await mockRequest.post('/notes').send(obj).set('Authorization', `Bearer ${token}`)
    const noteObject = response.body;

    expect(response.status).toBe(201);
    expect(noteObject._id).toBeDefined();
    expect(noteObject.notes[0].note).toEqual(expected.note)
  });

  it('should get a note', async() => {
    try{
      const response1 = await mockRequest.post('/signin').auth('admin', 'password');
      const token = response1.body.token;
      let obj = { note: 'test_note_2' };
      let expected = { note: 'test_note_2' };
      const response2 = await mockRequest.post('/notes').send(obj).set('Authorization', `Bearer ${token}`);
      const noteObject = response2.body;
      const res = await mockRequest.get(`/notes/${noteObject.notes[1]._id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body._id).toEqual(noteObject.notes[1]._id);
      expect(res.body.note).toEqual(expected.note);
    } catch(err) {
      console.error(err.message);
    }
  });


  it('should get all notes', async() => {
    const responseToken = await mockRequest.post('/signin').auth('admin', 'password');
    const token = responseToken.body.token;

    let obj = { note: 'test_note_3' };
    let obj2 = { note: 'test_note_4' };

    await mockRequest.post('/notes').send(obj).set('Authorization', `Bearer ${token}`);
    await mockRequest.post('/notes').send(obj2).set('Authorization', `Bearer ${token}`);
    const res = await mockRequest.get(`/notes`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    Object.keys(obj).forEach(item => {
          expect(res.body[2][item]).toEqual(obj[item])
    });
    expect(res.body[0].note).toEqual('test_note_1');
    expect(res.body[1].note).toEqual('test_note_2');
    expect(res.body[2].note).toEqual('test_note_3');
    expect(res.body[3].note).toEqual('test_note_4');
   
  });

  it('admin can update a note', async() => {
    const responseToken = await mockRequest.post('/signin').auth('admin', 'password');
    const token = responseToken.body.token;
    let obj = { note: 'test_note_5' };
    let updatedObj = { note: 'test_update_note_5' };
    let expected = { note: 'test_update_note_5' };

    const response1 = await mockRequest.post('/notes').send(obj).set('Authorization', `Bearer ${token}`);
    const response = await mockRequest.put(`/notes/${response1.body.notes[4]._id}`).send(updatedObj).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.notes[4].note).toEqual(expected.note);
  });

  it('admin can delete() a note', async() => {
    const responseToken = await mockRequest.post('/signin').auth('admin', 'password');
    const token = responseToken.body.token;

    let obj = { note: 'test_note_6' };
    let expected = { note: 'test_note_6' };

    const response1 = await mockRequest.post('/notes').send(obj).set('Authorization', `Bearer ${token}`);
    const response2 = await mockRequest.delete(`/notes/${response1.body.notes[5]._id}`).set('Authorization', `Bearer ${token}`);

    expect(response2.status).toBe(200);
    console.log(response2.body);
    expect(response2.body.notes[5]).toBe(undefined);
  });

});