'use strict';

process.env.SECRET = "toes";

const { server } = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server);

let users = {
  admin: { username: 'admin', password: 'password', notes:[], role: 'admin' },
  editor: { username: 'editor', password: 'password', notes:[], role: 'editor' },
  writer: { username: 'writer', password: 'password', notes:[], role: 'writer' },  
  user: { username: 'user', password: 'password', notes: [], role: 'user' },
};

describe('Auth Router', () => {
  
  Object.keys(users).forEach(userType => {
    
    describe(`${userType} users`, () => {
  
      it('1. can create one', async () => {

        const response = await mockRequest.post('/signup').send(users[userType]);
        const userObject = response.body;

        expect(response.status).toBe(201);
        expect(userObject.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
        expect(userObject.user.username).toEqual(users[userType].username)

      });

      it('2. can signin with basic', async () => {

        const response = await mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password);

        const userObject = response.body;
        expect(response.status).toBe(200);
        expect(userObject.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
        expect(userObject.user.username).toEqual(users[userType].username)

      });

      it('3. can signin with bearer', async () => {

        // First, use basic to login to get a token
        const response = await mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password);

        const token = response.body.token;

        // First, use basic to login to get a token
        const bearerResponse = await mockRequest
          .get('/users')
          .set('Authorization', `Bearer ${token}`)

        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(200);

      });

      it('can access secret route', async() => {
                // First, use basic to login to get a token
                const response = await mockRequest.post('/signin')
                .auth(users[userType].username, users[userType].password);
      
              const token = response.body.token;
      
              // First, use basic to login to get a token
              const bearerResponse = await mockRequest
                .get('/secret')
                .set('Authorization', `Bearer ${token}`)
      
              // Not checking the value of the response, only that we "got in"
              expect(bearerResponse.status).toBe(200);
      })
    });

    describe('bad logins', () => {
      it('4. basic fails with known user and wrong password ', async () => {

        const response = await mockRequest.post('/signin')
          .auth('admin', 'xyz')
        const userObject = response.body;

        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();

      });

      it('5. basic fails with unknown user', async () => {

        const response = await mockRequest.post('/signin')
          .auth('nobody', 'xyz')
        const userObject = response.body;

        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined()

      });

      it('6. bearer fails with an invalid token', async () => {

        // First, use basic to login to get a token
        const bearerResponse = await mockRequest
          .get('/users')
          .set('Authorization', `Bearer foobar`)

        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(500);

      })

      it('should deny access to secret route', async () => {

        // First, use basic to login to get a token
        const bearerResponse = await mockRequest
          .get('/secret')
          .set('Authorization', `Bearer foobar`)

        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(500);

      })

    })

  });

});