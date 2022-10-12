import mongoose from 'mongoose';
import { app } from './app'
import { natsWrapper } from './nats-wrapper';
import { TicketUpdatedListerner } from './events/listeners/ticket-updated-listener';
import { TicketCreatedListerner } from './events/listeners/ticket-created-listener';

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
    // initating event listener
    new TicketCreatedListerner(natsWrapper.client).listen()
    new TicketUpdatedListerner(natsWrapper.client).listen()
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
