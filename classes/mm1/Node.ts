import Packet from "./Packet";

export default class Node {
  buffer: Packet[] = [];
  simulationTime = 0;
  waitTime = 0;
  idleTime = 0;
  processedPackets = 0;

  processPacket() {
    const packet = this.buffer.shift();

    if (packet) {
      if (packet.arrivalTime < this.simulationTime) {
        this.simulationTime += packet.serviceTime;
      } else {
        this.idleTime += packet.arrivalTime - this.simulationTime;
        this.simulationTime = packet.arrivalTime + packet.serviceTime;
      }

      this.waitTime +=
        this.simulationTime - packet.arrivalTime - packet.serviceTime;

      this.processedPackets++;
    }
  }
}
