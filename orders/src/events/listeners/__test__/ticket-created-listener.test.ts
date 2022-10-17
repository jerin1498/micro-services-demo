import { TicketCreatedEvent } from "@jhticketss/common";
import { Message } from "node-nats-streaming";
import mongoose from 'mongoose';
import { TicketCreatedListerner } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = () => {
  // crate a instance of a listiner
  const listener = new TicketCreatedListerner(natsWrapper.client)
  // crate a fake data event 
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'Concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString()
  }
  // create a fake messge object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }

}

it('create and saves a ticket', async () => {
  const { listener, data, msg } = await setup()
  // call the onMessage function with data object + message object
  await listener.onMessage(data, msg)
  // write assetetions to check the ticket was created  
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)

})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  // call the onMessage function with data object + message object
  await listener.onMessage(data, msg)
  // write assetetions to check the ticket was created  
  expect(msg.ack).toHaveBeenCalled()
})