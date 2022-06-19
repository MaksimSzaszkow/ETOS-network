export default class Packet {
  id;
  arrivalTime;
  departureTime = 0;
  serviceTime;
  priority;
  source;

  constructor(
    id: number,
    arrivalTime: number,
    serviceTime: number,
    priority: 0 | 1 | 2,
    source: 0 | 1 | 2
  ) {
    this.id = id;
    this.arrivalTime = arrivalTime;
    this.serviceTime = serviceTime;
    this.priority = priority;
    this.source = source;
  }
}
