import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@jhticketss/common';
import { Order, OrderStatus } from '../models/orders';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const Router = express.Router()

Router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params
  const order = await Order.findById(orderId).populate('ticket')
  if (!order) {
    throw new NotFoundError()
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }
  order.status = OrderStatus.Cancelled
  await order.save()
  // emmiting order cancelled events

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id
    }
  })

  res.status(204).send(order)
})


export { Router as deleteOrderRouter };