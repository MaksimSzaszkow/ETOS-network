import Packet from "./Packet";

export default class PrioNode {
  simulationTime = 0;
  packets;
  processedPackets: Packet[] = [];

  idleTime = 0;
  delayTime = 0;

  constructor(packets: Packet[]) {
    this.packets = packets;

    while (this.packets.length) {
      const prio1InBuffer = this.packets.filter(
        (packet) =>
          packet.arrivalTime <= this.simulationTime && packet.priority === 0
      );
      const prio2InBuffer = this.packets.filter(
        (packet) =>
          packet.arrivalTime <= this.simulationTime && packet.priority === 1
      );
      const prio3InBuffer = this.packets.filter(
        (packet) =>
          packet.arrivalTime <= this.simulationTime && packet.priority === 2
      );

      let packet =
        prio1InBuffer.shift() || prio2InBuffer.shift() || prio3InBuffer.shift();

      if (packet) {
        const index = this.packets.indexOf(packet);
        this.packets.splice(index, 1);

        this.simulationTime += packet.serviceTime;
        packet.departureTime = this.simulationTime;
        this.processedPackets.push(packet);
        this.delayTime +=
          this.simulationTime - packet.arrivalTime - packet.serviceTime;
      } else if (this.packets.length) {
        this.idleTime += this.packets[0].arrivalTime - this.simulationTime;
        this.simulationTime = this.packets[0].arrivalTime;
      } else break;
    }

    this.delayTime /= this.processedPackets.length;
  }
}
