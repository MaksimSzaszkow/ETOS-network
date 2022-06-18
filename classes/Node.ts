import Packet from "./Packet";

export default class Node {
  simulationTime = 0;
  packets;
  processedPackets: Packet[] = [];

  idleTime = 0;
  packetWaitTime = 0;
  packetCountInBuffer = 0;

  Ti = 0;
  Tn = 0;
  Qn = 0;

  constructor(packets: Packet[]) {
    this.packets = packets;
  }

  processPacket(packet: Packet | undefined) {
    if (packet) {
      const index = this.packets.indexOf(packet);
      this.packets.splice(index, 1);

      this.simulationTime += packet.serviceTime;
      packet.departureTime = this.simulationTime;

      const newPacket = JSON.parse(JSON.stringify(packet));

      this.processedPackets.push(newPacket);
    } else {
      this.idleTime += this.packets[0].arrivalTime - this.simulationTime;
      this.simulationTime = this.packets[0].arrivalTime;
    }
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

        this.packetCountInBuffer += packetsInBuffer.length;
        this.packetWaitTime +=
          packet.departureTime - packet.arrivalTime - packet.serviceTime;
      });
  }
}
