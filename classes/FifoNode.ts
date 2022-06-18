import Node from "./Node";
import Packet from "./Packet";

export default class FifoNode extends Node {
  constructor(packets: Packet[]) {
    super(packets);

    while (this.packets.length) {
      const packetsInBuffer = this.packets.filter(
        (packet) => packet.arrivalTime <= this.simulationTime
      );

      const packet = packetsInBuffer.shift();

      this.processPacket(packet);
    }

    this.postSimulationStats();
  }
}
