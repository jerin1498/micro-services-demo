import request from 'supertest';
import { app } from '../../app';


it('fail if email does not exited is supplyed', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'jerin@gmial.com',
      password: 'testtest'
    })
    .expect(400)
})

it('fails if incorrect password is provided', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'jerin@gmail.com',
      password: 'testtest'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'jerin@gmail.com',
      password: 'diffpass'
    })
    .expect(400)
})


it('It return a cookie if valid credientials is provided', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'jerin@gmail.com',
      password: 'testtest'
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'jerin@gmail.com',
      password: 'testtest'
    })
    .expect(200)
  expect(response.get('Set-Cookie')).toBeDefined()
})