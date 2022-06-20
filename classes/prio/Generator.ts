import Packet from "./Packet";
import poisson from "poisson-process";

export default class Generator {
  meanPacketCount;
  meanServiceTime;
  generatedPackets = 0;
  priorities: number[];

  lastPacketTime = 0;

  constructor(
    meanPacketCount: number,
    meanServiceTime: number,
    priorities: number[]
  ) {
    this.meanPacketCount = meanPacketCount;
    this.meanServiceTime = meanServiceTime;
    this.priorities = priorities;
  }

  generateNext() {
    this.lastPacketTime =
      this.lastPacketTime + poisson.sample(1 / this.meanPacketCount);

    const rand = Math.random() * 1;

    let priority: 0 | 1 | 2;
    if (rand <= this.priorities[0]) priority = 0;
    else if (rand <= this.priorities[0] + this.priorities[1]) priority = 1;
    else priority = 2;

    this.generatedPackets++;
    return new Packet(
      poisson.sample(this.meanServiceTime),
      this.lastPacketTime,
      priority
    );
  }
}
