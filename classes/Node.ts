import Packet from "./Packet";

export default class Node {
  simulationTime = 0;
  packets;
  processedPackets: Packet[] = [];

  idleTime = 0;
  delayTime = 0;

  constructor(packets: Packet[]) {
    this.packets = packets;
  }

  processPacket(packet: Packet | undefined) {
    if (packet) {
      const index = this.packets.indexOf(packet);
      this.packets.splice(index, 1);

      this.simulationTime += packet.serviceTime;
      packet.departureTime = this.simulationTime;

      this.processedPackets.push(packet);
      this.delayTime +=
        this.simulationTime - packet.arrivalTime - packet.serviceTime;
    } else {
      this.idleTime += this.packets[0].arrivalTime - this.simulationTime;
      this.simulationTime = this.packets[0].arrivalTime;
    }
  }
}
