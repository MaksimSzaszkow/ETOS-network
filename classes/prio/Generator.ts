import Packet from "./Packet";
import poisson from "poisson-process";

export default class Generator {
  meanPacketCount;
  meanServiceTime;
  generatedPackets = 0;
  source0GeneratedPackets = 0;
  lastPacketTime = 0;

  constructor(meanPacketCount: number, meanServiceTime: number) {
    this.meanPacketCount = meanPacketCount;
    this.meanServiceTime = meanServiceTime;
  }

  generateNext() {
    this.lastPacketTime =
      this.lastPacketTime + poisson.sample(1 / this.meanPacketCount);
    const source = Math.random() * 1 <= 0.5 ? 0 : 1;
    this.generatedPackets++;
    if (source === 0) {
      this.source0GeneratedPackets++;
    }

    return new Packet(
      poisson.sample(this.meanServiceTime),
      this.lastPacketTime,
      source
    );
  }
}
