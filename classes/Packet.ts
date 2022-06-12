export default class Packet {
  arrivalTime;
  departureTime = 0;
  serviceTime;
  priority;
  source;

  constructor(
    arrivalTime: number,
    serviceTime: number,
    priority: number,
    source: 0 | 1 | 2
  ) {
    this.arrivalTime = arrivalTime;
    this.serviceTime = serviceTime;
    this.priority = priority;
    this.source = source;
  }
}
