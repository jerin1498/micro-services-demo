import { Publisher, OrderCancelledEvent, Subjects } from "@jhticketss/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}   