import { OnOffGeneratorConfig } from "../interfaces/Scenario";
import Packet from "./Packet";

export default class OnOffGenerator {
  public packets: Packet[] = [];

  private packetCount;
  private meanServiceTime;
  private priorities;
  private source;

  constructor(config: OnOffGeneratorConfig, packetsAmount: number) {
    this.packetCount = config.packetCount;
    this.meanServiceTime = config.meanServiceTime;
    this.priorities = config.priorities
      .split(" ")
      .map((priority) =>
        parseFloat(priority.substring(0, priority.length - 1))
      );
    this.source = config.source;

    this.generatePackets(
      packetsAmount,
      config.offset,
      config.tonPacketAmount,
      config.toffTime
    );
  }

  public generatePackets(
    packetsAmount: number,
    offset: number,
    TonPacketAmount: number,
    ToffTime: number
  ) {
    let lastPacketTime = offset - 1 / this.packetCount;
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
