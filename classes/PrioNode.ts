import Node from "./Node";
import Packet from "./Packet";

export default class PrioNode extends Node {
  packetWaitTimeBuffers = {
    0: 0,
    1: 0,
    2: 0,
  };
  packetCountInBuffers = {
    0: 0,
    1: 0,
    2: 0,
  };
  packetCountPerBuffer = {
    0: 0,
    1: 0,
    2: 0,
  };

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

    this.postSimulationStats();
  }

  postSimulationStats() {
    this.processedPackets
      .sort((a, b) => a.arrivalTime - b.arrivalTime)
      .forEach((packet) => {
        const packetsInBuffer = this.processedPackets.filter(
          (p) =>
            p.departureTime > packet.arrivalTime &&
            p.arrivalTime <= packet.arrivalTime
        );
        const packetInBuffers = {
          0: this.processedPackets.filter(
            (p) =>
              p.priority === 0 &&
              p.departureTime > packet.arrivalTime &&
              p.arrivalTime <= packet.arrivalTime
          ),
          1: this.processedPackets.filter(
            (p) =>
              p.priority === 1 &&
              p.departureTime > packet.arrivalTime &&
              p.arrivalTime <= packet.arrivalTime
          ),
          2: this.processedPackets.filter(
            (p) =>
              p.priority === 2 &&
              p.departureTime > packet.arrivalTime &&
              p.arrivalTime <= packet.arrivalTime
          ),
        };

        this.packetCountInBuffer += packetsInBuffer.length;
        this.packetCountInBuffers[packet.priority] +=
          packetInBuffers[packet.priority].length;

        this.packetWaitTime +=
          packet.departureTime - packet.arrivalTime - packet.serviceTime;
        this.packetWaitTimeBuffers[packet.priority] +=
          packet.departureTime - packet.arrivalTime - packet.serviceTime;

        this.packetCountPerBuffer[packet.priority]++;
      });
  }
}
