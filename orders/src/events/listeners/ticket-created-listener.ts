import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@jhticketss/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from './queue-group-names';

export class TicketCreatedListerner extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id } = data;
    const ticket = await Ticket.build({
      id,
      title,
      price
    })
    await ticket.save()
    msg.ack()
  }
}