import Packet from "./Packet";
import poisson from "poisson-process";
import Generator from "./Generator";
import { GeneratorConfig } from "../interfaces/Scenario";

export default class PoissonGenerator extends Generator {
  constructor(config: GeneratorConfig, packetsAmount: number) {
    super(config);

    this.generatePackets(packetsAmount);
  }

  public generatePackets(packetsAmount: number) {
    let lastPacketTime = Math.random() * this.meanServiceTime;

    for (let i = 0; i < packetsAmount; i++) {
      let packetTime = lastPacketTime + poisson.sample(1 / this.packetCount);
      const rand = Math.floor(Math.random() * 100);
      const priority =
        rand <= this.priorities[0] ? 0 : rand <= this.priorities[1] ? 1 : 2;

      this.packets.push(
        new Packet(
          this.source * packetsAmount + i,
          packetTime,
          this.meanServiceTime,
          priority,
          this.source
        )
      );

      lastPacketTime = packetTime;
    }
  }
}
