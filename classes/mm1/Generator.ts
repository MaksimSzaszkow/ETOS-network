import Packet from "./Packet";
import poisson from "poisson-process";

export default class Generator {
  meanPacketCount;
  meanServiceTime;

  lastPacketTime = 0;

  constructor(meanPacketCount: number, meanServiceTime: number) {
    this.meanPacketCount = meanPacketCount;
    this.meanServiceTime = meanServiceTime;
  }

  generateNext() {
    this.lastPacketTime =
      this.lastPacketTime + poisson.sample(1 / this.meanPacketCount);

    return new Packet(
      poisson.sample(this.meanServiceTime),
      this.lastPacketTime
    );
  }
}
