import express, { Request, Response } from 'express';

const Router = express.Router()


Router.delete('/api/orders/:orderId', (req: Request, res: Response) => {
  res.send('data form ')
})


export { Router as deleteOrderRouter };