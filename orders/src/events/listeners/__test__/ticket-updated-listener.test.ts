import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Listener, TicketUpdatedEvent } from '@jhticketss/common';
import { TicketUpdatedListerner } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";


const setup = async () => {
  // create a listener
  const listener = new TicketUpdatedListerner(natsWrapper.client)
  // create and save a ticket 
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  })
  await ticket.save()
  // create a fake data obejct
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: 'asdfos'
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, ticket, msg }
}

it('find save update and save a ticket', async () => {
  const { listener, data, ticket, msg } = await setup()
  await listener.onMessage(data, msg);
  const updateTicket = await Ticket.findById(ticket.id)
  expect(updateTicket!.title).toEqual(data.title)
  expect(updateTicket!.price).toEqual(data.price)
  expect(updateTicket!.version).toEqual(data.version)
})

it('ack the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('does not call the event if the ticket has skipped version number', async () => {
  const { listener, data, ticket, msg } = await setup()
  data.version = 10;
  try {
    await listener.onMessage(data, msg)
  } catch (err) {

  }
  expect(msg.ack).not.toHaveBeenCalled();
})