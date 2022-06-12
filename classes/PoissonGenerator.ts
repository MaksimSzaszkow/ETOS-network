import { PoissonGeneratorConfgi } from "../interfaces/Scenario";
import Packet from "./Packet";

export default class PoissonGenerator {
  public packets: Packet[] = [];

  private packetCount;
  private meanServiceTime;
  private priorities;
  private source;

  constructor(config: PoissonGeneratorConfgi, packetsAmount: number) {
    this.packetCount = config.packetCount;
    this.meanServiceTime = config.meanServiceTime;
    this.priorities = config.priorities
      .split(" ")
      .map((priority) =>
        parseFloat(priority.substring(0, priority.length - 1))
      );
    this.source = config.source;

    this.generatePackets(packetsAmount, config.offset);
  }

  public generatePackets(packetsAmount: number, offset: number) {
    let lastPacketTime = offset;

    for (let i = 0; i < packetsAmount; i++) {
      let packetTime = lastPacketTime + this.poisson(1 / this.packetCount);
      const rand = Math.floor(Math.random() * 100);
      const priority =
        rand <= this.priorities[0] ? 0 : rand <= this.priorities[1] ? 1 : 2;

      this.packets.push(
        new Packet(packetTime, this.meanServiceTime, priority, this.source)
      );

      lastPacketTime = packetTime;
    }
  }

  poisson(a: number) {
    let limit = Math.exp(-a);
    var prod = Math.random();
    var n = 0;
    while (prod >= limit) {
      prod *= Math.random();
      n += 1;
    }
    let returnVal = n;
    if (returnVal != 0) {
      return returnVal;
    } else {
      return 1 / this.packetCount;
    }
  }
}
