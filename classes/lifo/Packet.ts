export default class Packet {
  arrivalTime;
  serviceTime;
  source;

  constructor(serviceTime: number, arrivalTime: number, source: 0 | 1) {
    this.serviceTime = serviceTime;
    this.arrivalTime = arrivalTime;
    this.source = source;
  }
}
