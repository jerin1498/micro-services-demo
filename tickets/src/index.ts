import mongoose from 'mongoose';
import { app } from './app'
import { OrderCreatedListiner } from './events/listeners/order-created-listener';
import { OrderCancelledListiner } from './events/listeners/order-cancelled-listener';
import { natsWrapper } from './nats-wrapper';


const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defind')
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defind')
  if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defind')
  if (!process.env.NATS_URL) throw new Error('NATS_URL must be defind')
  if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defind')

  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
    natsWrapper.client.on('close', () => {
      console.log('Nats connection closed')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new OrderCancelledListiner(natsWrapper.client).listen()
    new OrderCreatedListiner(natsWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI) //from mongo docker container
    console.log('connected to mongo db')
  } catch (err) {
    console.log(err)
  }
  app.listen(3000, () => {
    console.log('app is runnig on port 3000')
  })
}


start()
