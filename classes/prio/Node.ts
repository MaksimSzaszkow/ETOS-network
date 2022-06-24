import ExtraPacket from "./ExtraPacket";
import Packet from "./Packet";

export default class Node {
  buffer: Packet[] = [];
  simulationTime = 0;
  waitTime = 0;
  waitTimes = [0, 0];
  idleTime = 0;
  processedPackets = 0;
  extraPackets0: ExtraPacket[] = [];
  extraPackets1: Packet[] = [];

  processPacket() {
    let index = 0;

    for (let i = 0; i < this.buffer.length; i++) {
      if (
        this.buffer[i].arrivalTime <= this.simulationTime &&
        this.buffer[i].source === 1
      ) {
        index = i;
        break;
      }
    }

    const packet = this.buffer.splice(index, 1)[0];

    if (packet.arrivalTime > this.simulationTime) {
      this.idleTime += packet.arrivalTime - this.simulationTime;
      this.simulationTime = packet.arrivalTime;
    }
    this.waitTime += this.simulationTime - packet.arrivalTime;
    this.waitTimes[packet.source] += this.simulationTime - packet.arrivalTime;

    this.simulationTime += packet.serviceTime;
    this.processedPackets++;

    if (packet.source === 0) {
      const p = packet as ExtraPacket;
      const firstArrivalTime = p.firstArrivalTime;

      if (firstArrivalTime) {
        p.departureTime = this.simulationTime - packet.serviceTime;
        this.extraPackets0.push(p);
      } else {
        this.extraPackets0.push(
          new ExtraPacket(
            packet.serviceTime,
            this.simulationTime,
            packet.source,
            packet.arrivalTime
          )
        );
      }
    } else {
      this.extraPackets1.push(packet);
    }
  }
}
