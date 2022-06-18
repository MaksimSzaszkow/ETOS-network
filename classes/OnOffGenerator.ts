import { OnOffGeneratorConfig } from "../interfaces/Scenario";
import Generator from "./Generator";
import Packet from "./Packet";

export default class OnOffGenerator extends Generator {
  TonPacketAmount;
  ToffTime;
  packetsGenerated = 0;

  constructor(config: OnOffGeneratorConfig) {
    super(config);

    this.TonPacketAmount = config.tonPacketAmount;
    this.ToffTime = config.toffTime;

    const mi = 1 / this.packetCount;
    if (this.source === 0) this.lastPacketTime = -mi;
    else
      this.lastPacketTime =
        Math.random() *
          (this.TonPacketAmount / this.packetCount + this.ToffTime) -
        mi;
  }

  public generateNext(id: number) {
    const packetTime = this.lastPacketTime + this.mi;

    const rand = Math.floor(Math.random() * 100);
    const priority =
      rand <= this.priorities[0] ? 0 : rand <= this.priorities[1] ? 1 : 2;

    const packet = new Packet(
      id,
      packetTime,
      this.meanServiceTime,
      priority,
      this.source
    );

    this.packetsGenerated++;

    if (this.packetsGenerated === this.TonPacketAmount) {
      this.lastPacketTime += this.ToffTime;
      this.packetsGenerated = 0;
    }
    if (this.ToffTime === 0) this.lastPacketTime = packetTime;
    else this.lastPacketTime = packetTime;

    return packet;
  }
}
