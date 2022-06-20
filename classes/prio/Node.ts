import Packet from "./Packet";

export default class Node {
  buffer: Packet[] = [];
  simulationTime = 0;
  waitTime = 0;
  idleTime = 0;
  waitTimes = [0, 0, 0];
  packetCounts = [0, 0, 0];
  processedPackets = 0;

  processPacket() {
    let index = 0;
    let priority = 0;

    for (let i = 0; i < this.buffer.length; i++) {
      if (this.buffer[i].priority < priority) {
        index = i;
      }
    }

    const packet = this.buffer.splice(index, 1)[0];

    if (packet) {
      if (packet.arrivalTime < this.simulationTime) {
        this.simulationTime += packet.serviceTime;
      } else {
        this.idleTime += packet.arrivalTime - this.simulationTime;
        this.simulationTime = packet.arrivalTime + packet.serviceTime;
      }

      const waitTime =
        this.simulationTime - packet.arrivalTime - packet.serviceTime;
      this.waitTime += waitTime;
      this.waitTimes[packet.priority] += waitTime;
      this.processedPackets++;
      this.packetCounts[packet.priority]++;
    }
  }
}
