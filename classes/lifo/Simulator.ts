import Generator from "./Generator";
import Node from "./Node";
import SuppliedGenerator from "./SuppliedGenerator";

export default class Simulator {
  meanPacketCount = 80;
  meanServiceTime = 0.01;

  generator1 = new Generator(this.meanPacketCount, this.meanServiceTime);
  node1 = new Node();
  generator2 = new SuppliedGenerator(
    this.meanPacketCount,
    this.meanServiceTime,
    this.node1.extraPackets
  );
  node2 = new Node();

  start() {
    const packetAmount = 100000;
    let lastPacketArrival1 = 0;
    let lastPacketArrival2 = 0;

    while (
      this.node1.processedPackets < packetAmount &&
      this.node2.processedPackets < packetAmount
    ) {
      while (
        this.generator1.generatedPackets < packetAmount &&
        (lastPacketArrival1 < this.node1.simulationTime ||
          this.node1.buffer.length === 0)
      ) {
        const packet = this.generator1.generateNext();

        this.node1.buffer.push(packet);
        lastPacketArrival1 = packet.arrivalTime;
      }

      if (this.node1.buffer.length) this.node1.processPacket();

      while (
        this.generator2.generatedPackets < packetAmount &&
        (lastPacketArrival2 < this.node2.simulationTime ||
          this.node2.buffer.length === 0)
      ) {
        const limit =
          packetAmount -
          (this.generator1.source0GeneratedPackets /
            this.generator1.generatedPackets) *
            packetAmount -
          this.generator2.source0GeneratedPackets;

        const packet = this.generator2.generateNext(limit);

        if (packet) {
          this.node2.buffer.push(packet);
          lastPacketArrival2 = packet.arrivalTime;
        }
      }

      if (this.node2.buffer.length) this.node2.processPacket();
    }

    console.log({
      node1: {
        ro: 1 - this.node1.idleTime / this.node1.simulationTime,
        avgWaitTime: this.node1.waitTime / this.node1.processedPackets,
        avgPacketCount: this.node1.waitTime / this.node1.simulationTime,
      },
      node2: {
        ro: 1 - this.node2.idleTime / this.node2.simulationTime,
        avgWaitTime: this.node2.waitTime / this.node2.processedPackets,
        avgPacketCount: this.node2.waitTime / this.node2.simulationTime,
      },
      bufferStats: {
        // avgWaitTimePerPacket:
        //   this.node2.extraPackets
        //     .map(
        //       (packet) =>
        //         packet.arrivalTime -
        //         packet.firstArrivalTime +
        //         packet.departureTime -
        //         packet.arrivalTime
        //     )
        //     .reduce((prev, current) => prev + current) /
        //   this.node2.extraPackets.length /
        //   2,
        avgWaitTime:
          (this.node1.waitTime / this.node1.processedPackets +
            this.node2.waitTime / this.node2.processedPackets) /
          2,
      },
    });

    return {
      node1: {
        ro: 1 - this.node1.idleTime / this.node1.simulationTime,
        avgWaitTime: this.node1.waitTime / this.node1.processedPackets,
        avgPacketCount: this.node1.waitTime / this.node1.simulationTime,
      },
      node2: {
        ro: 1 - this.node2.idleTime / this.node2.simulationTime,
        avgWaitTime: this.node2.waitTime / this.node2.processedPackets,
        avgPacketCount: this.node2.waitTime / this.node2.simulationTime,
      },
    };
  }
}
