import { Listener, OrderCreatedEvent, Subjects } from "@jhticketss/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queue-group-name';
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";


export class OrderCreatedListiner extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket the order is creating 
    const ticket = await Ticket.findById(data.ticket.id);

    // if cant find any ticket throw error
    if (!ticket) throw new Error('Ticket not found')

    // mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id })
    await ticket.save()

    // publishing the updated version 
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    })

    // ack the message
    msg.ack()
  }
}