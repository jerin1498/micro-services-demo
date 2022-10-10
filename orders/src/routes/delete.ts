import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@jhticketss/common';
import { Order, OrderStatus } from '../models/orders';

const Router = express.Router()


Router.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
  const { orderId } = req.params
  const order = await Order.findById(orderId)
  if (!order) {
    throw new NotFoundError()
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }
  order.status = OrderStatus.Cancelled
  await order.save()
  res.status(204).send(order)
})


export { Router as deleteOrderRouter };