import { OrderStatus, ExpirationCompleteEvent } from "@jhticketss/common";
import { Message } from "node-nats-streaming";
import { ExpirationCompleteListiner } from "../expiration-complete-listiner";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/orders";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";

const setup = async () => {
  const listener = new ExpirationCompleteListiner(natsWrapper.client);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'alsjfasf',
    expiresAt: new Date(),
    ticket
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, order, ticket, data, msg }
}

it('update the order status to cancelled', async () => {
  const { listener, order, msg, data } = await setup();
  await listener.onMessage(data, msg);
  const updateOrder = await Order.findById(order.id);
  expect(updateOrder).toEqual(OrderStatus.Cancelled);

});

it('emit an order cancelled event', async () => {
  const { listener, order, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled()
  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(order.id)

});

it('ack the message', async () => {
  const { msg } = await setup();
  expect(msg.ack).toHaveBeenCalled()

})