import Packet from "./Packet";
import poisson from "poisson-process";

export default class Generator {
  meanPacketCount;
  meanServiceTime;
  generatedPackets = 0;
  priorities;
  tonPackets;
  toff;

  lastPacketTime = 0;

  constructor(
    meanPacketCount: number,
    meanServiceTime: number,
    priorities: number[],
    tonPackets: number,
    toff: number
  ) {
    this.meanPacketCount = meanPacketCount;
    this.meanServiceTime = meanServiceTime;
    this.priorities = priorities;
    this.tonPackets = tonPackets;
    this.toff = toff;
  }

  generateNext() {
    this.lastPacketTime = this.lastPacketTime + 1 / this.meanPacketCount;

    const rand = Math.random() * 1;

    let priority: 0 | 1 | 2;
    if (rand <= this.priorities[0]) priority = 0;
    else if (rand <= this.priorities[0] + this.priorities[1]) priority = 1;
    else priority = 2;

    this.generatedPackets++;
    if (this.generatedPackets % this.tonPackets === 0)
      this.lastPacketTime += this.toff;

    return new Packet(this.meanServiceTime, this.lastPacketTime, priority);
  }
}
