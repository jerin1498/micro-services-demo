import request from "supertest";
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order } from '../../models/orders';
import { OrderStatus } from "@jhticketss/common";


it('return a 404 if the purchase order is not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'lasnfsafsf',
      orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)
});

it('it return 401 if the request order is not belong to user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdfasfjio',
      orderId: order.id
    })
    .expect(401)
});

it('it return a 400 when the order status is cancelled', async () => {

});