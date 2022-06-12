import Packet from "./Packet";

export default class LifoNode {
  simulationTime = 0;
  packets;
  processedPackets: Packet[] = [];
  finalPackets: Packet[] = [];

  idleTime = 0;
  delayTime = 0;

  constructor(packets: Packet[], packetAmount: number) {
    this.packets = packets;

    while (this.finalPackets.length < packetAmount) {
      const packetsInBuffer = this.packets.filter(
        (packet) => packet.arrivalTime <= this.simulationTime
      );

      const packet = packetsInBuffer.pop();

      if (packet) {
        const index = this.packets.indexOf(packet);
        this.packets.splice(index, 1);

        this.simulationTime += packet.serviceTime;
        packet.departureTime = this.simulationTime;

        this.processedPackets.push(packet);
        if (packet.source === 0) {
          this.delayTime +=
            this.simulationTime - packet.arrivalTime - packet.serviceTime;
          this.finalPackets.push(packet);
        }
      } else if (this.packets.length) {
        this.idleTime += this.packets[0].arrivalTime - this.simulationTime;
        this.simulationTime = this.packets[0].arrivalTime;
      } else break;
    }
  }
}
