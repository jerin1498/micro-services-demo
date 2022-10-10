import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on sucessful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: "jerin@gmail.com",
      password: 'testtest'
    })
    .expect(201)
})


it('returns a 400 on invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: "jerin.com",
      password: 'testtest'
    })
    .expect(400)
})

it('returns a 400 on invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: "jerin.com",
      password: 'ee'
    })
    .expect(400)
})

it('returns a 400 on missign email and password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400)
})

it('returns a 400 on missign email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'jerin@gmail.com' })
    .expect(400)

  await request(app)
    .post('/api/users/signup')
    .send({ password: 'testtest' })
    .expect(400)
})

it('Not allow duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'jerin@gmail.com',
      password: 'testtest'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'jerin@gmail.com',
      password: 'testtest'
    })
    .expect(400)
})

it('set a cookie after sucessfull signin', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'jerin@gmail.com',
      password: 'testtest'
    })
    .expect(201)
  expect(response.get('Set-Cookie')).toBeDefined()
})