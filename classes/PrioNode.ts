import Node from "./Node";
import Packet from "./Packet";

export default class PrioNode extends Node {
  constructor(packets: Packet[]) {
    super(packets);

    while (this.packets.length) {
      const prio1InBuffer = this.packets
        .filter(
          (packet) =>
            packet.arrivalTime <= this.simulationTime && packet.priority === 0
        )
        .sort((a, b) => a.arrivalTime - b.arrivalTime);
      const prio2InBuffer = this.packets
        .filter(
          (packet) =>
            packet.arrivalTime <= this.simulationTime && packet.priority === 1
        )
        .sort((a, b) => a.arrivalTime - b.arrivalTime);
      const prio3InBuffer = this.packets
        .filter(
          (packet) =>
            packet.arrivalTime <= this.simulationTime && packet.priority === 2
        )
        .sort((a, b) => a.arrivalTime - b.arrivalTime);

      let packet =
        prio1InBuffer.shift() || prio2InBuffer.shift() || prio3InBuffer.shift();

      this.processPacket(packet);
    }

    this.delayTime /= this.processedPackets.length;
    this.calculateQnAndAvgPacketCount();
  }
}
