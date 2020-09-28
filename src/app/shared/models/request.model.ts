export class RequestModel {
  transactionId: string;
  event: string;
  action: string;
  type: string;
  payload: { data: {} };

  constructor(transactionId: string, event: string, action: string, type: string, payload: { data: {} }) {
    this.transactionId = transactionId;
    this.event = event;
    this.action = action;
    this.type = type;
    this.payload = payload;
  }
}
