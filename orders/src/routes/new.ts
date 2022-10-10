import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@jhticketss/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/orders';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const Router = express.Router()
const EXPERATION_WINDOW_SECONDS = 15 * 60; // 15 min

Router.post('/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('ticketId must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    //Find the ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) throw new NotFoundError()
    // make sure the ticket is not reserved or booked
    const isReserved = await ticket.isReserved()
    if (isReserved) throw new BadRequestError('Ticket already reserved')

    // calculating experation time for this ticket
    const experation = new Date()
    experation.setSeconds(experation.getSeconds() + EXPERATION_WINDOW_SECONDS)

    // save the ticket to the data base
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: experation,
      ticket
    })
    await order.save()
    // publish an event to say that the order is created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    })

    res.status(201).send(order)
  })


export { Router as newOrderRouter };