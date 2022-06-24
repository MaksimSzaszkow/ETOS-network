import Packet from "./Packet";
import poisson from "poisson-process";
import ExtraPacket from "./ExtraPacket";

export default class SuppliedGenerator {
  meanPacketCount;
  meanServiceTime;
  generatedPackets = 0;
  source0GeneratedPackets = 0;
  extraPackets0: ExtraPacket[];
  extraPackets1: Packet[];

  lastPacketTime = 0;

  constructor(
    meanPacketCount: number,
    meanServiceTime: number,
    extraPackets0: ExtraPacket[],
    extraPackets1: Packet[]
  ) {
    this.meanPacketCount = meanPacketCount;
    this.meanServiceTime = meanServiceTime;
    this.extraPackets0 = extraPackets0;
    this.extraPackets1 = extraPackets1;
  }

  generateNext() {
    const newTime =
      this.lastPacketTime + poisson.sample(1 / this.meanPacketCount);

    if (this.extraPackets0.length && this.extraPackets1.length) {
      this.generatedPackets++;
      if (
        this.extraPackets0[0].arrivalTime < this.extraPackets1[0].arrivalTime
      ) {
        this.source0GeneratedPackets++;
        return this.extraPackets0.shift();
      } else return this.extraPackets1.shift();
    } else if (this.extraPackets0.length && !this.extraPackets1.length) {
      this.generatedPackets++;
      this.source0GeneratedPackets++;
      return this.extraPackets0.shift();
    } else if (!this.extraPackets0.length && this.extraPackets1.length) {
      this.generatedPackets++;
      return this.extraPackets1.shift();
    }
  }
}
