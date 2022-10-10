import express, { Request, Response } from 'express';
import { requireAuth } from '@jhticketss/common';
import { Order } from '../models/orders';

const Router = express.Router()


Router.get('/api/orders',
  requireAuth,
  async (req: Request, res: Response) => {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate('ticket')
    res.send(orders)
  })


export { Router as indexOrderRouter }