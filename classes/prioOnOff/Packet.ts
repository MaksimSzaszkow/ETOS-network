export default class Packet {
  arrivalTime;
  serviceTime;
  priority = 0;

  constructor(serviceTime: number, arrivalTime: number, priotiry: 0 | 1 | 2) {
    this.serviceTime = serviceTime;
    this.arrivalTime = arrivalTime;
    this.priority = priotiry;
  }
}
