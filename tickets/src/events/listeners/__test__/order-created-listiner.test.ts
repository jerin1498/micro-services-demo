import { OrderCreatedEvent, OrderStatus } from "@jhticketss/common";
import mongoose from 'mongoose';
import { OrderCreatedListiner } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create a instance of listiner
  const listiner = new OrderCreatedListiner(natsWrapper.client)
  // create and save ticket
  const ticket = await Ticket.build({
    title: 'Concert',
    price: 88,
    userId: 'asdf'
  })
  await ticket.save()
  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'adfasf',
    expiresAt: 'asdfasf',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }

  // fake msg function 
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listiner, data, msg, ticket }
}

it('set the user id of the ticket', async () => {
  const { listiner, data, msg, ticket } = await setup()
  await listiner.onMessage(data, msg)
  const updateTicket = await Ticket.findById(ticket.id)
  expect(updateTicket!.orderId).toEqual(data.id)
})

it('its ack the message', async () => {
  const { listiner, data, msg } = await setup()
  await listiner.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})