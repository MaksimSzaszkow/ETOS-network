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

    return {
      ro: 1 - this.node.idleTime / this.node.simulationTime,
      avgWaitTime: this.node.waitTime / this.node.processedPackets,
      avgWaitTime0: this.node.waitTimes[0] / this.node.processedPackets,
      avgWaitTime1: this.node.waitTimes[1] / this.node.processedPackets,
      avgWaitTime2: this.node.waitTimes[2] / this.node.processedPackets,
      avgPacketCount: this.node.waitTime / this.node.simulationTime,
      avgPacketCount0: this.node.waitTimes[0] / this.node.simulationTime,
      avgPacketCount1: this.node.waitTimes[1] / this.node.simulationTime,
      avgPacketCount2: this.node.waitTimes[2] / this.node.simulationTime,
    };
  }
}
