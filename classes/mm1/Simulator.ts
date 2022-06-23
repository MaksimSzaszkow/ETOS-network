import Generator from "./Generator";
import Node from "./Node";

export default class Simulator {
  generator = new Generator(900, 0.001);
  node = new Node();

  start() {
    const packetAmount = 100000;
    let lastPacketArrival = 0;

    while (this.node.processedPackets < packetAmount) {
      while (
        this.generator.generatedPackets < packetAmount &&
        (lastPacketArrival < this.node.simulationTime ||
          this.node.buffer.length === 0)
      ) {
        const packet = this.generator.generateNext();

        this.node.buffer.push(packet);
        lastPacketArrival = packet.arrivalTime;
      }

      this.node.processPacket();
    }

    return {
      ro: 1 - this.node.idleTime / this.node.simulationTime,
      avgWaitTime: this.node.waitTime / this.node.processedPackets,
      avgPacketCount: this.node.waitTime / this.node.simulationTime,
    };
  }
}
