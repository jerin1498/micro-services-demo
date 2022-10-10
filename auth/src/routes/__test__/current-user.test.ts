import request from 'supertest';
import { app } from '../../app';


it('respond with detail with current loged in user', async () => {
  const cookie = await global.signin()

  const response = await request(app)
    .get('/api/users/currentuser')
    .set("Cookie", cookie)
    .send()
    .expect(200)
  expect(response.body.currentUser.email).toEqual('jerin@gmail.com')
})

it('responds null if not authorized', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)
  expect(response.body.currentUser).toEqual(null)
})