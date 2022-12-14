import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('Fetch the order', async () => {
  const ticketId = new mongoose.Types.ObjectId().toString()
  const ticket = Ticket.build({
    id: ticketId,
    title: 'concert',
    price: 20
  })
  await ticket.save()
  const user = global.signin()
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)
  expect(fetchOrder.id).toEqual(order.id)
})



it('error if one user try to fetch other user ticket', async () => {
  const ticketId = new mongoose.Types.ObjectId().toString()
  const ticket = Ticket.build({
    id: ticketId,
    title: 'concert',
    price: 20
  })
  await ticket.save()
  const user = global.signin()
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401)
})