import Packet from "./Packet";

export default class ExtraPacket extends Packet {
  firstArrivalTime;
  departureTime = 0;

  constructor(
    serviceTime: number,
    arrivalTime: number,
    source: 0 | 1,
    firstArrivalTime: number
  ) {
    super(serviceTime, arrivalTime, source);
    this.firstArrivalTime = firstArrivalTime;
  }
}
