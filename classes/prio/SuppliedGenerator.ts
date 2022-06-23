import Packet from "./Packet";
import poisson from "poisson-process";
import ExtraPacket from "./ExtraPacket";

export default class SuppliedGenerator {
  meanPacketCount;
  meanServiceTime;
  generatedPackets = 0;
  source0GeneratedPackets = 0;
  extraPackets: ExtraPacket[];

  lastPacketTime = 0;

  constructor(
    meanPacketCount: number,
    meanServiceTime: number,
    extraPackets: ExtraPacket[]
  ) {
    this.meanPacketCount = meanPacketCount;
    this.meanServiceTime = meanServiceTime;
    this.extraPackets = extraPackets;
  }

  generateNext(limit: number) {
    const newTime =
      this.lastPacketTime + poisson.sample(1 / this.meanPacketCount);

    if (this.extraPackets.length && limit <= 0) {
      this.lastPacketTime = this.extraPackets[0].arrivalTime;
      this.generatedPackets++;
      this.source0GeneratedPackets++;
      return this.extraPackets.shift() as Packet;
    } else {
      this.generatedPackets++;
      this.lastPacketTime = newTime;
      return new Packet(
        poisson.sample(this.meanServiceTime),
        this.lastPacketTime,
        1
      );
    }
  }
}
