import { OrderCancelledEvent } from "@jhticketss/common"
import mongoose from "mongoose"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListiner } from "../order-cancelled-listener"
import { Ticket } from "../../../models/ticket"
import { Message } from "node-nats-streaming"

const setup = async () => {
  const listiner = new OrderCancelledListiner(natsWrapper.client)
  const orderId = new mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'concert',
    price: 23,
    userId: 'sldfna'
  })
  ticket.set({ orderId })
  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listiner, data, orderId, msg, ticket }

}

it('update a ticket, publish a event and ack the message', async () => {
  const { listiner, data, orderId, msg, ticket } = await setup()

  await listiner.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})