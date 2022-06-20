import Generator from "./Generator";
import Node from "./Node";

export default class Simulator {
  generator = new Generator(80, 0.01, [0.6, 0.2, 0.1], 1, 0);
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
      `AVG WAIT PRIO 0: ${this.node.waitTimes[0] / this.node.packetCounts[0]}`
    );
    console.log(
      `AVG WAIT PRIO 1: ${this.node.waitTimes[1] / this.node.packetCounts[1]}`
    );
    console.log(
      `AVG WAIT PRIO 2: ${this.node.waitTimes[2] / this.node.packetCounts[2]}`
    );
    console.log(
      `AVG IN BUFFER: ${this.node.waitTime / this.node.simulationTime}`
    );
    console.log(
      `AVG IN BUFFER PRIO 0: ${
        this.node.waitTimes[0] / this.node.simulationTime
      }`
    );
    console.log(
      `AVG IN BUFFER PRIO 1: ${
        this.node.waitTimes[1] / this.node.simulationTime
      }`
    );
    console.log(
      `AVG IN BUFFER PRIO 2: ${
        this.node.waitTimes[2] / this.node.simulationTime
      }`
    );
  }
}
