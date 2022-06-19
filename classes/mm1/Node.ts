import Packet from "./Packet";

export default class Node {
  buffor: Packet[] = [];
  simulationTime = 0;
  waitTime = 0;
  idleTime = 0;

  processPacket() {
    this.buffor = this.buffor.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const packet = this.buffor.shift();

    if (packet) {
      if (packet.arrivalTime < this.simulationTime) {
        this.simulationTime += packet.serviceTime;
      } else {
        this.idleTime += packet.arrivalTime - this.simulationTime;
        this.simulationTime = packet.arrivalTime + packet.serviceTime;
      }
      this.waitTime +=
        this.simulationTime - packet.arrivalTime - packet.serviceTime;
    }

    return packet || new Packet(0, 0);
  }
}
