export default class Packet {
  arrivalTime;
  serviceTime;

  constructor(serviceTime: number, arrivalTime: number) {
    this.serviceTime = serviceTime;
    this.arrivalTime = arrivalTime;
  }
}
