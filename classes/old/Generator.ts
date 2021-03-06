import Packet from "./Packet";
import { GeneratorConfig } from "../../interfaces/Scenario";

export default class Generator {
  packets: Packet[] = [];

  packetCount;
  meanServiceTime;
  priorities;
  source;

  mi;
  lastPacketTime;

  constructor(config: GeneratorConfig) {
    this.packetCount = config.packetCount;
    this.meanServiceTime = config.meanServiceTime;
    this.priorities = config.priorities
      .split(" ")
      .map((priority) =>
        parseFloat(priority.substring(0, priority.length - 1))
      );
    this.source = config.source;

    this.mi = 1 / this.packetCount;
    this.lastPacketTime = -this.mi;
  }
}
