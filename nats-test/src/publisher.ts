import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear()
// stan == client
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
})

stan.on('connect', async () => {
  const publisher = new TicketCreatedPublisher(stan)
  try {
    publisher.publish({
      id: '123',
      title: 'concert',
      price: 29
    })
  } catch (err) {
    console.log(err)
  }
})