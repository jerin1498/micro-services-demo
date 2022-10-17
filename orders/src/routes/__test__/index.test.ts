import request from 'supertest';
import { Order } from '../../models/orders';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticketId = new mongoose.Types.ObjectId().toString()
  const ticket = Ticket.build({
    id: ticketId,
    title: 'Concert',
    price: 20
  })
  await ticket.save()
  return ticket
}

it('fetch order for particular user', async () => {
  // creating multiple tickets
  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket()
  const ticketThree = await buildTicket()
  // creating new user
  const userOne = global.signin()
  const userTwo = global.signin()
  // crating orders for user one
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  // crating orders for user two
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201)

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201)

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)
  // make sure that we got the right order
  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(orderOne.id)
  expect(response.body[1].id).toEqual(orderTwo.id)
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
  expect(response.body[1].ticket.id).toEqual(ticketThree.id)
})