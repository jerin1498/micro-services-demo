import { natsWrapper } from './nats-wrapper';
import { OrderCreateListener } from './events/listeners/order-created-listener';


const start = async () => {
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

    new OrderCreateListener(natsWrapper.client).listen()
  } catch (err) {
    console.log(err)
  }
}


start()
