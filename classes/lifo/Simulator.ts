import Generator from "./Generator";
import Node from "./Node";

export default class Simulator {
  generator = new Generator(80, 0.01);
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

    console.log(`RO: ${1 - this.node.idleTime / this.node.simulationTime}`);
    console.log(`AVG WAIT: ${this.node.waitTime / this.node.processedPackets}`);
    console.log(
      `AVG IN BUFFER: ${this.node.waitTime / this.node.simulationTime}`
    );
  }
}
