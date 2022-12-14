import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from "@jhticketss/common";
import { Message } from 'node-nats-streaming';
import { queueGroupName } from "./queue-group-names";
import { Order } from "../../models/orders";
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListiner extends Listener<ExpirationCompleteEvent>{
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket')
    if (!order) {
      throw new Error('Order not found')
    }
    order.set({
      status: OrderStatus.Cancelled
    })
    await order.save()

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    })
    msg.ack()
  }
}