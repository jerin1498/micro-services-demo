import { Publisher, OrderCreatedEvent, Subjects } from "@jhticketss/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

