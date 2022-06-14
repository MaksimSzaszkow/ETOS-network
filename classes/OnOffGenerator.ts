import { OnOffGeneratorConfig } from "../interfaces/Scenario";
import Generator from "./Generator";
import Packet from "./Packet";

export default class OnOffGenerator extends Generator {
  constructor(config: OnOffGeneratorConfig, packetsAmount: number) {
    super(config);

    this.generatePackets(
      packetsAmount,
      config.tonPacketAmount,
      config.toffTime
    );
  }

  public generatePackets(
    packetsAmount: number,
    TonPacketAmount: number,
    ToffTime: number
  ) {
    let lastPacketTime =
      Math.random() * this.meanServiceTime - 1 / this.packetCount;
    let packetsGenerated = 0;

    for (let i = 0; i < packetsAmount; i++) {
      let packetTime = lastPacketTime + 1 / this.packetCount;
      const rand = Math.floor(Math.random() * 100);
      const priority =
        rand <= this.priorities[0] ? 0 : rand <= this.priorities[1] ? 1 : 2;

      this.packets.push(
        new Packet(
          packetsAmount * this.source + i,
          packetTime,
          this.meanServiceTime,
          priority,
          this.source
        )
      );
      packetsGenerated++;

      if (packetsGenerated == TonPacketAmount) {
        lastPacketTime += ToffTime;
        packetsGenerated = 0;
      } else {
        lastPacketTime = packetTime;
      }
    }
  }
}
