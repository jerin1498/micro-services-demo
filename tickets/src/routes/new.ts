import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@jhticketss/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router()

router.post('/api/tickets',
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('price must be greater than zero')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id
    })
    await ticket.save()
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    })
    return res.status(201).send(ticket)
  }
)


export { router as createTicketRouter };