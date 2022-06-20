import Packet from "./Packet";

export default class Node {
  buffer: Packet[] = [];
  simulationTime = 0;
  waitTime = 0;
  idleTime = 0;
  processedPackets = 0;

  processPacket() {
    let packet: Packet | undefined;

    for (let i = this.buffer.length - 1; i >= 0; i--) {
      if (this.buffer[i].arrivalTime < this.simulationTime) {
        packet = this.buffer.splice(i, 1)[0];
        break;
      }
    }

    if (!packet) {
      packet = this.buffer.pop() as Packet;
      this.idleTime += packet.arrivalTime - this.simulationTime;
      this.simulationTime = packet.arrivalTime;
    }

    if (packet) {
      this.simulationTime += packet.serviceTime;

      this.waitTime +=
        this.simulationTime - packet.arrivalTime - packet.serviceTime;

      this.processedPackets++;
    }
  }
}
