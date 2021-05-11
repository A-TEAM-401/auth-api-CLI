'use strict';

const { server } = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

describe('404:', () => {

  it('should respond with a 404 on bad route', async() => {
    const data = await mockRequest.get('/bad-route');
    expect(data.status).toBe(404);
  });

  it('should respond with a 404 on bad method', async() => {
    const data = await mockRequest.post('/notes/1');
    expect(data.status).toBe(404);
  });

})