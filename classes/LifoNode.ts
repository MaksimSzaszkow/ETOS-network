import Node from "./Node";
import Packet from "./Packet";

export default class LifoNode extends Node {
  constructor(packets: Packet[]) {
    super(packets);

    while (this.packets.length) {
      const packetsInBuffer = this.packets.filter(
        (packet) => packet.arrivalTime <= this.simulationTime
      );

      const packet = packetsInBuffer.pop();

      this.processPacket(packet);
    }

    this.delayTime /= this.processedPackets.length;
    this.calculateQnAndAvgPacketCount();
  }
}
